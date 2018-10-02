import { Color } from "./Color";

export class Player{
    name:string;
    color: Color;

    constructor(name: string, color: Color){
        this.name=name;
        this.color= color;
    }

}