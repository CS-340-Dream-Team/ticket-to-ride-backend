import { BaseHandler } from "./BaseHandler";
import {Request, Response} from "express"
import {ErrorMsgs} from "../model/ErrorMsgs"
import { Command } from "../commands/Command";
export class GamePlayHandler extends BaseHandler{

    constructor(){
        super();
    }

    handle(req: Request, res:Response):void{
        try{
            if(req.method==="GET")
            {
                //See top 5 bus cards
                if(req.url==="/play/bus"){
                    
                    if(!req.headers.authorization){
                        throw new Error(ErrorMsgs.NO_AUTHORIZATION)
                    }
                    
                    let command = this.model.getSpread(req.headers.authorization);
                    //sends back a Command not a GameCommand b/c doesn't modify the name
                    res.status(200).send({
                        command: command
                    });
                    
                }
                //Draw 3 route cards
                else if(req.url==="/play/routes"){
                    let command=this.model.drawRoutes(req.headers.authorization);
                    res.status(200).send({command:command})
                }
                // Get full game data (used for refresh)
                else if(req.url==="/play") {
                    let command = this.model.getFullGame(req.headers.authorization);
                    res.status(200).send({
                        command: command
                    })
                }
                // Poll for game updates
                else if(req.url.startsWith("/play/")) {  // FIXME Check if this should be ===
                    let commands = this.model.getGameData(req.headers.authorization, req.params.id);
                    res.status(200).send({
                        commands: commands
                    })  
                }
                else{
                    throw Error(ErrorMsgs.ENDPOINT_DNE)
                }
            }
            else if(req.method==="POST")
            {
                //Select a bus card from the deck. 0-4 represent face-up cards, 5 represents a random card from the face-down deck.
                if (req.url===`/play/bus/${req.params.index}`){
                    //this.pickBusCard(game:Game)
                }
                //Purpose: Claim a segment
                else if (req.url==='/play/segment'){

                }
                //Purpose: Discard a route card
                else if (req.url==='/play/routes') {
                    let command=this.model.discardRoutes(req.headers.authorization, req.body.rejectedRoutes)
                    res.status(200).send({command:command})
                }
                else{
                    throw Error(ErrorMsgs.ENDPOINT_DNE)
                }
            }
            else{
                throw Error(ErrorMsgs.ENDPOINT_DNE)
            }
        }
        catch(e){
            res.status(400).send({command:new Command("showError",{message: e.message})}) 
        }
    }


}