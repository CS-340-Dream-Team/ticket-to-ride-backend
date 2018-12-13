import { Game } from "../model/Game";

export interface IGameDao {
	saveGame(req: Game): Promise<boolean>;
	getGameById(GameId: number): Promise<Game>;
	getAllGames(): Promise<Game[]>;
	removeGameById(GameId: number): Promise<null>;
	clearGames(): Promise<null>;
}