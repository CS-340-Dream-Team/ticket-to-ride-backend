export interface IUserDao {
	saveUser(): void;
	getUser(id: number): JSON;
}
