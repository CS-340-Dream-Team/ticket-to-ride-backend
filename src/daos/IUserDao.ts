import { UserDto } from "../model/UserRegistration";

export interface IUserDao {
	saveUser(user: UserDto): void;
	getUser(id: number): UserDto;
	getAllUsers(): UserDto[];
}
