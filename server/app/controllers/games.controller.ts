import { GamesService } from '@app/services/local.games.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';
import { MouseHandlerService } from '@app/services/mouse-handler.service';

@Service()
export class GamesController {
    router: Router;

    constructor(private gamesService: GamesService, private mouseHandler: MouseHandlerService) {
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
                res.sendStatus(StatusCodes.CREATED);
            }
            else {
                res.sendStatus(StatusCodes.BAD_REQUEST);
            }
        });

        this.router.post(`/imagesdata`, (req: Request, res: Response) => {
            console.log('aaa')
            this.mouseHandler.updateImageData(req.body)
          });
    }
}
