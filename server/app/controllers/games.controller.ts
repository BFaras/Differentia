import { GamesService } from '@app/services/local.games.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';

@Service()
export class GamesController {
    router: Router;

    constructor(private gamesService: GamesService) {
        gamesService = new GamesService();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        /**
         * @swagger
         *
         * definitions:
         *   Message:
         *     type: object
         *     properties:
         *       title:
         *         type: string
         *       body:
         *         type: string
         */

        /**
         * @swagger
         * tags:
         *   - name: Time
         *     description: Time endpoints
         */

        /**
         * @swagger
         *
         * /api/date:
         *   get:
         *     description: Return current time
         *     tags:
         *       - Time
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         */
        this.router.get(`/`, async (req: Request, res: Response) => {
            res.json(await this.gamesService.getAllGames());
        });

        this.router.post(`/newGame`, async (req: Request, res: Response) =>  {
            const newGame = req.body;
            if(await this.gamesService.addGame(newGame)) {
                res.json(StatusCodes.CREATED);
                // je devrais pas faire des json avec des codes mais je devrais faire
                // faire des res.sendStatus(StatusCodes.CREATED) mais comment je fais
                // pour récupérer ce code du côté client?????
            }
            else {
                res.json(StatusCodes.BAD_REQUEST);
                // je devrais pas faire des json avec des codes mais je devrais faire
                // faire des res.sendStatus(StatusCodes.BAD_REQUEST) mais comment je fais
                // pour récupérer ce code du côté client?????
            }
        })
    }
}
