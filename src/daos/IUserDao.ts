import { UserDto, UserRegistration } from "../model/UserRegistration";

export interface IUserDao {
	saveUser(user: UserDto): Promise<boolean>;
	getUserByName(name: string): Promise<UserDto>;
	getAllUsers(): Promise<UserDto[]>;
	removeUserByName(name: string): Promise<null>;
}
