import {ICommand} from "./ICommand"
export class UpdateGameListCommand implements ICommand{
    data:Object;
    constructor(data:Object){
        this.data=data;
    }
}