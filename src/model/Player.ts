import { PlayerColor } from "./PlayerColor";

export class Player{
    name:string;
    color: PlayerColor;

    constructor(name: string, color: PlayerColor){
        this.name=name;
        this.color= color;
    }

}