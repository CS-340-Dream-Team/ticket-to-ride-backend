import {ICommand} from "./ICommand"
export class RegisterCommand implements ICommand{
    data:Object;
    constructor(data:Object){
        this.data=data;
    }
}