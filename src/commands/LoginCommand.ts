import {ICommand} from "./ICommand"
export class LoginCommand implements ICommand{
    data:Object;
    constructor(data:Object){
        this.data=data;
    }
}