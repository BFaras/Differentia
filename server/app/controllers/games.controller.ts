import { GamesService } from '@app/services/local.games.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class GamesController {
    router: Router;

    constructor(private gamesService: GamesService) {
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
        this.router.get(`/`, (req: Request, res: Response) => {
            // Send the request to the service and send the response
                console.log(this.gamesService.getAllGames());
                res.json(this.gamesService.getAllGames());
                // .then((time: Message) => {
                //     res.json(time);
                // })
                // .catch((reason: unknown) => {
                //     const errorMessage: Message = {
                //         title: 'Error',
                //         body: reason as string,
                //     };
                //     res.json(errorMessage);
                // });
        });
    }
}
