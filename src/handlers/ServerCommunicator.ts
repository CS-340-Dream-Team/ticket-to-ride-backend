import express from "express";
import * as bodyParser from "body-parser";
import cors from 'cors';
import { Request, Response } from "express";
import { RegisterHandler } from "./RegisterHandler";
import { LoginHandler } from "./LoginHandler";
import { GamesHandler } from "./GamesHandler";
import { ChatHandler } from "./ChatHandler";
import { Player } from "../model/Player";
import { GamePlayHandler} from "./GamePlayHandler";
import { MapHandler } from "./MapHandler";
import { Command } from "../commands/Command";
import { DrawSpread } from "../model/DrawSpread";
import { RouteCard } from "../model/RouteCard";

export class ServerCommunicator {

    private mapHandler: MapHandler = new MapHandler(); 
    private registerHandler: RegisterHandler = new RegisterHandler();
    private loginHandler: LoginHandler = new LoginHandler();
    private gamesHandler: GamesHandler = new GamesHandler();
    private chatHandler: ChatHandler = new ChatHandler();
    private gameplayHandler: GamePlayHandler = new GamePlayHandler();
  
    constructor() {
        const port = 4040;
        this.app = express();
        this.app.listen(port, function() {
        console.log('Express server listening on port ' + port);
        });
        this.config();
        this.routes();
    }

    public app: express.Application;

    private config(): void {
        // the number of seconds to cache the cors OPTIONS preflight request
        const maxAge = 600;
        this.app.use(cors({ maxAge }));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(function (req, res, next) {
            res.header("Content-Type",'application/json');
            next();
        });
    }

    private routes(): void {
        const router = express.Router();

        router.get('/', (req: Request, res: Response) => {
            res.status(200).send({
                message: "Root endpoint reached"
            })
        });

        router.post('/login', (req: Request, res: Response) => {
            this.loginHandler.handle(req, res);
        });

        router.post('/register', (req: Request, res: Response) => {
            this.registerHandler.handle(req, res);
        });
        
        router.get('/map', (req: Request, res: Response) => {
            this.mapHandler.handle(req, res);
        });

        router.post('/games', (req: Request, res: Response) => {
            this.gamesHandler.handle(req, res);
        });

        router.get('/games', (req: Request, res: Response) => {
            this.gamesHandler.handle(req, res);
        })

        router.post('/games/:id/join', (req: Request, res: Response) => {
            this.gamesHandler.handle(req, res);
        });

        router.delete('/games/:id', (req: Request, res: Response) => {
            this.gamesHandler.handle(req, res);
        });

        router.post('/games/:id/start', (req: Request, res: Response) => {
            this.gamesHandler.handle(req, res);
        });

        router.post('/chat/new/:timestamp', (req: Request, res: Response) => {
            this.chatHandler.handle(req, res);
        });

        router.get('/chat/:timestamp', (req: Request, res: Response) => {
            this.chatHandler.handle(req, res);
        });

        router.post('/play/segment', (req:Request, res:Response)=>{
            this.gameplayHandler.handle(req, res);
        })
        router.post('/play/bus/:index', (req:Request, res:Response)=>{
            this.gameplayHandler.handle(req, res);
        })
        router.get('/play/bus', (req:Request, res:Response)=>{
            this.gameplayHandler.handle(req, res);
        })
        router.get('/play/routes', (req:Request, res:Response)=>{
            this.gameplayHandler.handle(req, res);
        })
        router.delete('/play/bus', (req:Request, res:Response)=>{
            this.gameplayHandler.handle(req, res);
        })
        router.get('/play/:id', (req:Request, res:Response)=>{
            console.log(req.params.id);
            let routeCards = [
                {
                    "name": "Gains 'n' Grades",
                    "points": 4,
                    "start": {
                       "name": "The Testing Center",
                       "latLong": {
                          "lat": 40.245433,
                          "long": -111.652399
                       }
                    },
                    "end": {
                       "name": "Vasa",
                       "latLong": {
                          "lat": 40.240334,
                          "long": -111.642054
                       }
                    }
                 } as RouteCard,
                 {
                    "name": "America's Passtime",
                    "points": 5,
                    "start": {
                       "name": "J-Dawgs",
                       "latLong": {
                          "lat": 40.245286,
                          "long": -111.646318
                       }
                    },
                    "end": {
                       "name": "Baseball Stadium",
                       "latLong": {
                          "lat": 40.254821,
                          "long": -111.651125
                       }
                    }
                 } as RouteCard,
                 {
                    "name": "Comfort Food",
                    "points": 6,
                    "start": {
                       "name": "DMV",
                       "latLong": {
                          "lat": 40.233169,
                          "long": -111.656048
                       }
                    },
                    "end": {
                       "name": "Chip Cookie",
                       "latLong": {
                          "lat": 40.24028,
                          "long": -111.661463
                       }
                    }
                 } as RouteCard
            ];
            let clientPlayer = new Player("Client Player", 1);
            clientPlayer.routeCards = routeCards;
            if (req.params.id == -1) {
                res.status(200).send({
                    commands: [
                        new Command("updateSpread", {
                            spread: new DrawSpread().getSpread(),
                            deckSize: 110
                        }),
                        new Command("updateClientPlayer", {
                            player: clientPlayer,
                            // { What the object looks like
                            //     name: "Client Player",
                            //     color: 1,
                            //     points: 0,
                            //     busPieces: 45,
                            //     busCards: [],
                            //     routeCards: routeCards
                            // }
                        }),
                        new Command("updateOpponentPlayers", {
                            players: [
                                {
                                    name: "Opponent 1",
                                    color: 2,
                                    points: 0,
                                    busPieces: 45,
                                    busCards: 0,
                                    routeCards: 3
                                },
                                {
                                    name: "Opponent 2",
                                    color: 3,
                                    points: 0,
                                    busPieces: 45,
                                    busCards: 0,
                                    routeCards: 2
                                },
                                {
                                    name: "Opponent 3",
                                    color: 4,
                                    points: 0,
                                    busPieces: 45,
                                    busCards: 0,
                                    routeCards: 2
                                }
                            ]
                        })
                    ]
                })
            } else {
                res.status(200).send({
                    commands: [new Command("doNothing", {
                        nothing: 'nothing'
                    })]
                })
            }
            // this.gameplayHandler.handle(req, res);
        })
        this.app.use('/', router);
    }

}