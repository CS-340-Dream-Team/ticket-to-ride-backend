import {ICommand} from "./ICommand"
export class ErrorCommand implements ICommand{
    data:Object;
    constructor(error:Error){
        this.data=error;
    }
}