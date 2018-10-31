import {ICommand} from "./ICommand"

export class Command implements ICommand{
    type:string;
    data:Object;
    id?: number;
    constructor(type:string, data:Object){
        this.type=type;
        this.data=data;
    }
}