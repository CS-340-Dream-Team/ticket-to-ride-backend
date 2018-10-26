import express from "express";
import * as bodyParser from "body-parser";
import cors from 'cors';
import { Request, Response } from "express";
import { RegisterHandler } from "./RegisterHandler";
import { LoginHandler } from "./LoginHandler";
import { GamesHandler } from "./GamesHandler";
import { GamePlayHandler} from "./GamePlayHandler";
import { MapHandler } from "./MapHandler";

export class ServerCommunicator {

    private mapHandler: MapHandler = new MapHandler(); 
    private registerHandler: RegisterHandler = new RegisterHandler();
    private loginHandler: LoginHandler = new LoginHandler();
    private gamesHandler: GamesHandler = new GamesHandler();
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
        router.post('/games/:id/start', (req: Request, res: Response)=>{
            this.gamesHandler.handle(req, res);
        })
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
        router.get('/play', (req:Request, res:Response)=>{
            this.gameplayHandler.handle(req, res);
        })
        this.app.use('/', router);
    }

}