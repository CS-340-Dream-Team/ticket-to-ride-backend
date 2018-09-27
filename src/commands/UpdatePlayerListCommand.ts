import {ICommand} from "./ICommand"
export class UpdatePlayerListCommand implements ICommand{
    data:Object;
    constructor(data:Object){
        this.data=data;
    }
}