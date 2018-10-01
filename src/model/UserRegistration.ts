import { IUserRegistration } from "./IUserRegistration";

export class UserRegistration implements IUserRegistration{
    password:string;
    tokens:string[];
    username:string;
    constructor(username:string, password:string, token:string){
        this.password=password;
        //Make a list of tokens
        this.tokens= [];
        this.tokens.push(token);
        this.username=username;
    }

}