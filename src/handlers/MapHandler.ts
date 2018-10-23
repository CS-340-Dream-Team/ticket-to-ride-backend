import { BaseHandler } from "./BaseHandler";
import { Request, Response } from "express";
import {ErrorMsgs} from "../model/ErrorMsgs";
import { MapDataManager } from "../model/MapDataManager";

export class MapHandler extends BaseHandler{

    constructor() {
        super();
    }

    handle(req: Request, res: Response): void {
        try {
            const manager = MapDataManager.getInstance();
            const locations = manager.locations;
            const segments = manager.segments;
            res.status(200).send({
                locations: locations,
                segments: segments
            });
        } catch(e) {
            if(e.message===ErrorMsgs.DATA_DOES_NOT_EXIST)
            {
                res.status(403).send({
                    message: e.message
                })
            }
            else{
                res.status(400).json({
                    message: e.message
                })
            }
            
        }
    }
}