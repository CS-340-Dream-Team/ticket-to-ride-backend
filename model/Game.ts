import {Player} from "./Player"
export class Game{
    playersJoined: Array<Player>;
    host: Player;
    name: string;
    numPlayers: number;
}