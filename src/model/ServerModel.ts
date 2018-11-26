import { Game } from "./Game";
import { Player } from "./Player";
import { UserRegistration } from "./UserRegistration";
import { Command } from "../commands/Command";
import { ErrorMsgs } from "./ErrorMsgs";
import { CommandManager } from "../commands/CommandManager";
import { Message } from "./Message";
import { GameState } from "./GameState";
import hat from "hat";
import { BusDeck } from "./BusDeck";
import { DrawSpread } from "./DrawSpread";
import { GameCommand } from "../commands/GameCommand";
import { RouteCard } from "./RouteCard";
import { ICommand } from "../commands/ICommand";
import { ChatCodes } from "../commands/ChatCodes";
import { BusColor } from "./BusColor";
import { Segment } from "./Segment";
import { GameOverStat } from "./IGameOverStat";
import { BusCard } from './BusCard';
import { PlayerState } from "./PlayerState";
import { Chat } from "./Chat";
import loadJSON from '../utils/jsonLoader';
const segments = loadJSON('src/data/segments.json');

export class ServerModel {
  private static _instance: ServerModel;
  private commandManager: CommandManager;
  private unstartedGames: Game[];
  private startedGames: { [key: number]: Game };
  private loggedInUsers: UserRegistration[];
  private allUsers: UserRegistration[];
  private unstartedGameLimit: number;

  private segmentsClaimed: boolean[] = segments.map(() => false);


  private segmentAlreadyClaimed(segmentId: number): boolean {
      return this.segmentsClaimed[segmentId];
  }

  private markSegmentClaimed(segmentId: number): void {
      this.segmentsClaimed[segmentId] = true;
  }

  private getSegmentById(segmentId: number) {
      return segments[segmentId];
  }

  private constructor() {
    if (ServerModel._instance) {
      throw new Error("Error: Instantiation failed");
    }

    ServerModel._instance = this;
    this.commandManager = new CommandManager();
    this.unstartedGames = [];
    this.startedGames = {};
    this.loggedInUsers = [];
    this.allUsers = [];
    this.unstartedGameLimit = 6;
  }

  public static getInstance(): ServerModel {
    if (ServerModel._instance === undefined) {
      ServerModel._instance = new ServerModel();
    }

    return ServerModel._instance;
  }

  login(username: string, password: string): string {
    if (!username || !password) {
      throw new Error(ErrorMsgs.USERNAME_OR_PASSWORD_UNDEFINED);
    }
    var user = this.getUserByUsername(username);
    if (!user || (user && user.password !== password)) {
      throw new Error(ErrorMsgs.WRONG_USERNAME_OR_PASSWORD);
    }
    this.loggedInUsers.push(user);
    let token = hat();
    user.tokens.push(token);
    return token;
  }

  register(username: string, password: string): string {
    if (!username || !password) {
      throw new Error(ErrorMsgs.USERNAME_OR_PASSWORD_UNDEFINED);
    }
    var user = this.getUserByUsername(username);
    if (user) {
      throw new Error(ErrorMsgs.USERNAME_EXISTS);
    }
    let token = hat();
    user = new UserRegistration(username, password, token);
    this.allUsers.push(user);
    this.loggedInUsers.push(user);
    let id = hat();
    user.tokens.push(token);

    return token;
  }

  deleteGame(id: number): Command {
    var game = this.getGameById(id);
    if (!game) {
      throw new Error(ErrorMsgs.GAME_DOES_NOT_EXIST);
    }
    let index = this.unstartedGames.indexOf(game);
    this.unstartedGames.splice(index, 1);
    return new Command("updateGameList", { gameList: this.unstartedGames });
  }

  joinGame(bearerToken: string | undefined, gameId: number): Command {
    let user = this.getUserByToken(bearerToken);
    let gameToJoin = this.getGameById(gameId);
    if (!gameToJoin) {
      throw new Error(ErrorMsgs.GAME_DOES_NOT_EXIST);
    }
    if (this.isPlayerInAGame(user.player)) {
      throw new Error(ErrorMsgs.PLAYER_ALREADY_IN_GAME);
    }
    gameToJoin.addPlayer(user.player);
    return new Command("updatePlayerList", {
      playerList: gameToJoin.playersJoined
    });
  }

  createGame(bearerToken: string | undefined, gameName: string): Command {
    let hostUser = this.getUserByToken(bearerToken);
    let game = this.getGameByName(gameName);
    if (gameName === "") {
      throw new Error(ErrorMsgs.GAMENAME_UNDEFINED);
    }
    if (game) {
      throw new Error(ErrorMsgs.GAME_ALREADY_EXISTS);
    }
    if (this.unstartedGames.length + 1 > this.unstartedGameLimit) {
      throw new Error(ErrorMsgs.UNSTARTED_LIMIT);
    }
    if (this.isPlayerInAGame(hostUser.player)) {
      throw new Error(ErrorMsgs.PLAYER_ALREADY_IN_GAME_CANNOT_CREATE);
    }
    this.unstartedGames.push(new Game(hostUser.player, gameName));
    return new Command("updateGameList", { gameList: this.unstartedGames });
  }

  startGame(bearerToken: string | undefined, gameId: number): Command {
    let game = this.getGameById(gameId);
    let playerName = this.getUsernameByToken(bearerToken);
    if (!game) {
      throw new Error(ErrorMsgs.GAME_DOES_NOT_EXIST);
    } else if (game.numPlayers < 2) {
      throw new Error(ErrorMsgs.NOT_ENOUGH_PLAYERS);
    } else if (game.host.name !== playerName) {
      throw new Error(ErrorMsgs.NOT_HOST);
    }
    game.started = true;
    this.deleteGame(game.id);
    this.startedGames[game.id] = game;
    game.assignColors();
    this.commandManager.addGame();
    game.initBusCards();
    game.playersJoined.forEach(player => {
      if (game) {
        player.routeCardBuffer = game.drawRoutes();
        this.commandManager.addCommand(
          game.id,
          "drawRoutes",
          game.routeDeck.getNumCards(),
          player.routeCardBuffer,
          player.name
        );
        if (player.name === 'Betty the Bot') {
            player.routeCards.push(...player.routeCardBuffer);
            this.commandManager.addCommand(
                game.id,
                "discardRoutes",
                { numCardsKept: 3 },
                {cardsKept: player.routeCardBuffer},
                player.name
            );
            player.routeCardBuffer = [];
        }
      }
    });
    return new Command("startGame", {});
  }

  getGameList(bearerToken: string | undefined): Command {
    let user = this.getUserByToken(bearerToken);
    let commandToReturn = new Command("updateGameList", {
      gameList: this.unstartedGames
    });
    Object.values(this.startedGames).forEach(game => {
      if(game.ended===false){
        game.playersJoined.forEach(player => {
          if (player.name === user.username) {
            commandToReturn = new Command("gameStarted", { game: game });
          }
        });
      }
    });
    return commandToReturn;
  }

  drawRoutes(bearerToken: string | undefined): GameCommand {
    let game = this.getGameByToken(bearerToken);
    let user = this.getUserByToken(bearerToken);
    let player = user.player;
    if (game === undefined) {
      throw new Error("Game is undefined");
    }
    if (this.commandManager.inDrawingCardState(game.id)) {
        throw new Error(ErrorMsgs.CANNOT_DRAW_ROUTE_CARDS);
    }
    let hand = game.drawRoutes();
    player.routeCardBuffer = hand;
    let command = this.commandManager.addCommand(
      game.id,
      "drawRoutes",
      game.routeDeck.getNumCards(),
      hand,
      player.name
    );
    return command;
  }

  discardRoutes(
    bearerToken: string | undefined,
    discardedCards: RouteCard[]
  ): GameCommand {
    let game = this.getGameByToken(bearerToken);
    let user = this.getUserByToken(bearerToken);
    let player = user.player;
    if (game === undefined) {
      throw new Error("Game is undefined");
    }
    discardedCards.forEach(discardedCard => {
      player.routeCardBuffer.forEach((bufferCard, i) => {
        if (discardedCard.name === bufferCard.name) {
          player.routeCardBuffer.splice(i, 1);
        }
      });
    });
    player.routeCards.push(...player.routeCardBuffer);
    let publicData = { numCardsKept: player.routeCardBuffer.length };
    let privateData = { cardsKept: player.routeCardBuffer };
    player.routeCardBuffer = [];
    game.routeDeck.discard(discardedCards);

    let command = this.commandManager.addCommand(
      game.id,
      "discardRoutes",
      publicData,
      privateData,
      player.name
    );
    if (this.commandManager.isInitialized(game.id, game.numPlayers)) {
        let newPlayer = this.incrementGameTurn(game);
        this.commandManager.addCommand(game.id, 'incrementTurn', {playerTurnName: newPlayer}, {}, player.name);
    }
    return command;
  }

  getSpread(bearerToken: string): Command {
    let game = this.getGameByToken(bearerToken);
    if (!game) {
      throw new Error(ErrorMsgs.GAME_DOES_NOT_EXIST);
    }
    return new Command("updateSpread", {
      spread: game.spread.getSpread(),
      deckSize: game.spread.getBusDeckCount()
    });
  }

  public getSegmentsClaimedByPlayer(player: Player): Segment[] {
    console.warn("This has not been implemented yet!");
    return [];
  }

  /**
   * Claims a segment for the given player
   * @param bearerToken Auth token from client request
   */
  public claimSegment(bearerToken: string, segmentId: number, cards: BusCard[]) {
      const game = this.getGameByToken(bearerToken)
      const user = this.getUserByToken(bearerToken)

      if (game === undefined) throw new Error(ErrorMsgs.GAME_DOES_NOT_EXIST);
      if (this.segmentAlreadyClaimed(segmentId)) throw new Error(ErrorMsgs.SEGMENT_ALREADY_CLAIMED);
      if (user.player.hasCards(cards)) throw new Error(ErrorMsgs.NOT_ENOUGH_CARDS);

      user.player.segments.push(segmentId);

      user.player.removeCards(cards);

      cards.forEach(card => {
          game.spread.busDeck.discardCard(card);
      });

      this.markSegmentClaimed(segmentId);
    const command = this.commandManager.addCommand(game.id, "claimSegment", { segmentId: segmentId, player: user.player.name }, {}, user.player.name);
      return command;
  }

  private getGameByToken(bearerToken: string | undefined): Game | undefined {
    let user = this.getUserByToken(bearerToken);
    let returnGame = null;
    Object.values(this.startedGames).forEach(game => {
      game.playersJoined.forEach(player => {
        if (player.name === user.player.name) {
          returnGame = game;
        }
      });
    });
    if (returnGame != null) {
      return returnGame;
    } else {
      throw new Error(ErrorMsgs.PLAYER_NOT_IN_A_GAME);
    }
  }

  addMessage(
    bearerToken: string | undefined,
    messageText: string,
    prevTimestamp: number
  ): Command {
    let user = this.getUserByToken(bearerToken);
    let player = user.player;
    let game = this.getGameByPlayer(player);
    var command;
    if (Object.values(ChatCodes).includes(messageText)) {
      command = this.handleChatCode(game.id, messageText, player.name);
    } else {
      let message = new Message(messageText, player);
      this.startedGames[game.id].chat.messages.push(message); //TODO: make sure startedGames are in the same order?
      game.chat.messages.push(message);
      command = this.commandManager.addChatCommand(
        game.id,
        message,
        prevTimestamp
      );
    }
    return command;
  }

  getMessagesAfter(
    bearerToken: string | undefined,
    prevTimestamp: number
  ): Command[] {
    let user = this.getUserByToken(bearerToken);
    let player = user.player;
    let game = this.getGameByPlayer(player);
    return this.commandManager.getMessagesAfter(game.id, prevTimestamp);
  }

  private handleChatCode(
    gameId: number,
    messageText: string,
    playerName: string
  ): Command {
    let game = this.startedGames[gameId];
    switch (messageText) {
      case ChatCodes.INCREMENT_TURN:
        let name = this.incrementGameTurn(game);
        return this.commandManager.addCommand(
          game.id,
          "incrementTurn",
          { playerTurnName: name },
          {},
          playerName
        );
      case ChatCodes.DRAW_BUS:
        let card = game.giveCardToPlayer(5, 'Betty the Bot');
        let turnOver = this.commandManager.inDrawingCardState(game.id);
        this.commandManager.addCommand(game.id, 'drawBusCard', {}, {'cardColor': card.color}, 'Betty the Bot');
        if (turnOver) {
          let newPlayer = this.incrementGameTurn(game);
          this.commandManager.addCommand(game.id, 'incrementTurn', {playerTurnName: newPlayer}, {}, playerName);        
        }
        let newSpreadData = {spread: game.spread.getSpread(), deckSize: game.spread.getBusDeckCount()};
        return this.commandManager.addCommand(game.id, 'updateSpread', newSpreadData, {}, 'Betty the Bot');
      case ChatCodes.END_GAME:
        const stats: GameOverStat[] = game.calculateScores(
          [] /** Pass him all the segments */
        );
        game.endGame();
        return this.commandManager.addCommand(
          game.id,
          "endGame",
          { stats },
          {},
          playerName
        );
      case ChatCodes.DRAW_ROUTES:
        let hand = game.drawRoutes();
        let player = game.players.filter(gamePlayer => gamePlayer.name === 'Betty the Bot')[0];
        player.routeCardBuffer = hand;
        this.commandManager.addCommand(
            game.id,
            "drawRoutes",
            game.routeDeck.getNumCards(),
            hand,
            player.name
        );
        player.routeCards.push(...player.routeCardBuffer);
        this.commandManager.addCommand(
                game.id,
                "discardRoutes",
                { numCardsKept: 3 },
                {cardsKept: player.routeCardBuffer},
                player.name
            );
        player.routeCardBuffer = [];
        let newPlayer = this.incrementGameTurn(game);
        return this.commandManager.addCommand(game.id, 'incrementTurn', {playerTurnName: newPlayer}, {}, playerName);
        case ChatCodes.DRAW_10:
        let cards=game.drawTen(playerName);
        let spread_data = {spread: game.spread.getSpread(), deckSize: game.spread.getBusDeckCount()};
        this.commandManager.addCommand(game.id, 'updateSpread', spread_data, {}, playerName);
        return this.commandManager.addCommand(game.id, 'drawTen', 10,{'cards':cards},playerName)
      default:
        throw new Error(ErrorMsgs.INVALID_COMMAND);
      }
    }
    
    selectBusCard(bearerToken: string|undefined, index: number): ICommand[] {
        let game = this.getGameByToken(bearerToken);
        if(!game) {
            throw new Error(ErrorMsgs.GAME_DOES_NOT_EXIST)
        }
        let player = this.getUserByToken(bearerToken);
        let card = game.giveCardToPlayer(index, player.username);
        if (card.color === BusColor.wild && index < 5 && this.commandManager.inDrawingCardState(game.id)) {
            game.revokePlayerCard(player.username, index);
            throw new Error(ErrorMsgs.CANNOT_DRAW_RAINBOW);
        }
        let turnOver = (card.color === BusColor.wild && index < 5) || this.commandManager.inDrawingCardState(game.id);
        let publicData = index < 5 ? {'cardColor': card.color} : {};
        let drawCommand = this.commandManager.addCommand(game.id, 'drawBusCard', publicData, {'cardColor': card.color}, player.username);
        let newSpreadData = {spread: game.spread.getSpread(), deckSize: game.spread.getBusDeckCount()};
        let newSpreadCommand = this.commandManager.addCommand(game.id, 'updateSpread', newSpreadData, {}, player.username);
        if (turnOver) {
            let newPlayer = this.incrementGameTurn(game);
            let incrementCommand = this.commandManager.addCommand(game.id, 'incrementTurn', {playerTurnName: newPlayer}, {}, player.username);
            return [drawCommand, newSpreadCommand, incrementCommand];
        } else {
            return [drawCommand, newSpreadCommand];
        }
    }

  private incrementGameTurn(game: Game): string {
    game.turn += 1;
    game.turn = game.turn % game.playersJoined.length;
    return game.playersJoined[game.turn].name;
  }

  getGameData(bearerToken: string | undefined, prevId: string): ICommand[] {
    let user = this.getUserByToken(bearerToken);
    let player = user.player;
    let game = this.getGameByPlayer(player);

    let gameState = new GameState(game, player.name);
    let playerStates = gameState.playerStates;
    let commands: ICommand[] = [];
    try {
      let commandId = parseInt(prevId);
      commands.push(
        ...this.commandManager.getGameplayAfter(
          game.id,
          commandId,
          player.name
        )
      );
    } catch (e) {
      console.log("messed up in getGameData()");
    }

    return commands;
  }

  getFullGame(bearerToken: string | undefined): ICommand {
    let user = this.getUserByToken(bearerToken);
    let player = user.player;
    let game = this.getGameByPlayer(player);
    let gameState = new GameState(game, player.name);
    var turn;
    var history: Command[];
    var id;
    if (this.commandManager.isInitialized(game.id, game.playersJoined.length)) {
      turn = game.playersJoined[game.turn].name;
      history = this.commandManager.getGameplayAfter(game.id, -0, player.name);
      id = this.commandManager.getLastId(game.id);
    } else {
      turn = "";
      history = [];
      id = -1;
    }

    return new Command("updateGame", {
      clientPlayer: player,
      players: gameState.playerStates,
      busDeckSize: gameState.busDeckCount,
      routeDeckSize: gameState.routeDeckCount,
      spread: game.spread.spread,
      turn: turn,
      history: history,
      id: id
    });
  }

  private getUserByUsername(username: string): UserRegistration | null {
    for (let user of this.allUsers) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  private getUserByToken(bearerToken: string | undefined): UserRegistration {
    if (!bearerToken) {
      throw new Error(ErrorMsgs.NO_AUTHORIZATION);
    }
    let token = this.extractToken(bearerToken);
    for (let user of this.loggedInUsers) {
      if (user.tokens.includes(token)) {
        return user;
      }
    }
    throw new Error(ErrorMsgs.INVALID_AUTHORIZATION);
  }

  private getUsernameByToken(bearerToken: string | undefined): string {
    let name = this.getUserByToken(bearerToken).username;
    return name;
  }

  private getGameByName(name: string): Game | null {
    for (let game of this.unstartedGames) {
      if (game.name == name) {
        return game;
      }
    }
    return null;
  }

  private getGameById(id: number): Game | null {
    for (let game of this.unstartedGames) {
      if (game.id == id) {
        return game;
      }
    }
    return null;
  }

  private getGameByPlayer(player: Player): Game {
    var foundGame = null;
    Object.values(this.startedGames).forEach(game => {
        for (let joinedPlayer of game.playersJoined) {
          if (joinedPlayer === player) {
            foundGame = game;
          }
        }
    });
    if (foundGame) {
      return foundGame;
    }
    throw new Error(ErrorMsgs.PLAYER_NOT_IN_GAME);
  }

  private extractToken(bearerToken: string): string {
    let bearer = "Bearer: ";
    if (!bearerToken.startsWith(bearer)) {
      throw new Error(ErrorMsgs.INVALID_AUTHORIZATION);
    }
    return bearerToken.replace(bearer, "");
  }

  private isPlayerInAGame(player: Player): boolean {
    for (let game of this.unstartedGames) {
      if (game.playersJoined.includes(player)) {
        return true;
      }
    }
    return false;
  }
}
