import { IUserDao } from "../IUserDao";

export class UserMariaDBDao implements IUserDao{
    constructor(){}
    saveUser(){

    }
    getUser(id:number){
        return {username:"u",password:"p"}
    }
    getAllUsers(){
        return []
    }
}