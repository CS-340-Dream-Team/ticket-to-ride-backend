import { BaseHandler } from "./BaseHandler";
import {Request, Response} from "express"
import { Command } from "../commands/Command";
import {ErrorMsgs} from "../model/ErrorMsgs"
export class GamePlayHandler extends BaseHandler{

    constructor(){
        super();
    }

    handle(req: Request, res:Response):void{
        if(req.method==="GET")
        {
            //See top 5 bus cards
            if(req.url==="/play/bus"){
                try {
                    /*
                    let command = this.model.getSpread(req.headers.authorization);
                    res.status(200).send({
                        command: command
                    });
                    */
                } catch(e) {
                        res.status(400).send({
                            message: e.message
                        })
                    }
            }
            //Draw 3 route cards
            else if(req.url==="/play/routes"){

            }
            // Poll for game updates
            else if(req.url==="/play"){
                let command = this.model.getGameData(req.headers.authorization, req.params.id);
                res.status(200).send({
                    command: command
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
            else{
                throw Error(ErrorMsgs.ENDPOINT_DNE)
            }
        }
        //Purpose: Discard a route card
        else if(req.method==="DELETE")
        {
            
        }
        else{
           throw Error(ErrorMsgs.ENDPOINT_DNE)
        }
    }
    private drawRoutes(){

    }


}