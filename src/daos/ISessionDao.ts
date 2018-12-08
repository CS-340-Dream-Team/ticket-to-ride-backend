import { SessionDto } from "../model/UserRegistration";

export interface ISessionDao {
	saveSession(session: SessionDto): void;
	getAllSessions(): SessionDto[];
}
