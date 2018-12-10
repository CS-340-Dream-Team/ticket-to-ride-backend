import { Game } from "../model/Game";

export interface IGameDao {
	saveGame(req: Game): Promise<boolean>;
	getGameById(GameId: number): Promise<Game>;
	removeGameById(GameId: number): Promise<null>;
}