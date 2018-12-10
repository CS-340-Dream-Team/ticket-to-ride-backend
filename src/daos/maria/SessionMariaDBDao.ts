import { ISessionDao } from "../ISessionDao";
import {SessionDto} from "../../model/UserRegistration"
export class SessionMariaDBDao implements ISessionDao{
    constructor(){}
    saveSession(){

    }
    getSession(){
        return JSON
    }
    getAllSessions(){
        let result:SessionDto[]=[];
        return result;
    }
}