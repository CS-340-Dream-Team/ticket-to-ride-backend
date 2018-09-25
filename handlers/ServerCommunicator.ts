import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { RegisterHandler } from "./RegisterHandler";
import { LoginHandler } from "./LoginHandler";
import { GamesHandler } from "./GamesHandler";

export class ServerCommunicator {

    private registerHandler: RegisterHandler;
    private loginHandler: LoginHandler;
    private gamesHandler: GamesHandler;

    constructor() {
        this.registerHandler = new RegisterHandler();
        this.loginHandler = new LoginHandler();
        this.gamesHandler = new GamesHandler();
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
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {
        const router = express.Router();

        router.get('/', (req: Request, res: Response) => {
        res.status(200).send({
            message: "Root endpoint reached"
        })
        });

        router.post('/login', (req: Request, res: Response) => {
            let handler = new LoginHandler();
            let response = handler.handle(req);
            res.status(200).send({
                message: "Login endpoint reached"
            });
        });
        
        router.post('/register', (req: Request, res: Response) => {
            let handler = new RegisterHandler();
            let response = handler.handle(req);
            res.status(200).send({
                message: "Register endpoint reached"
            });
        });
        
        router.post('/games', (req: Request, res: Response) => {
            let handler = new GamesHandler();
            let response = handler.handle(req);
            res.status(200).send({
                message: "Games endpoint reached"
            });
        });

        router.post('/games/:id/join', (req: Request, res: Response) => {
            let handler = new GamesHandler();
            let response = handler.handle(req);
            res.status(200).send({
                message: "Join game endpoint reached",
                params: req.params
            });
        })

        router.delete('/games/:id'), (req: Request, res: Response) => {
            let handler = new GamesHandler();
            let response = handler.handle(req);
            res.status(200).send({
                message: "Delete endpoint reached",
                params: req.params
            });
        }

        this.app.use('/', router);
    }

}