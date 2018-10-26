import { LatLong } from "./LatLong";

export class Location{
    name:string;
    latLong:LatLong;
    constructor(name: string, latLong:LatLong){
        this.name=name
        this.latLong=latLong
    }
}