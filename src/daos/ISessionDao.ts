import { SessionDto } from "../model/UserRegistration";

export interface ISessionDao {
	saveSession(session: SessionDto): Promise<Boolean>;
	getAllSessions(): Promise<SessionDto[]>;
	removeSessionsByUser(name: string): Promise<null>;
}
