import { ICommand } from "./ICommand";

export class GameCommand implements ICommand{
    type:string
    data:Object
    privateData:Object
    player:string
    id:number
    constructor(type:string, data:Object, privateData:Object, player:string, id:number){
        this.type=type
        this.data=data
        this.privateData=privateData
        this.player=player
        this.id =id
    }
    
}