import { GamesService } from '@app/services/local.games.service';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class GamesController {
    router: Router;

    constructor(private gamesService: GamesService) {
        gamesService = new GamesService();
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.get(`/`, async (req: Request, res: Response) => {
            res.json(await this.gamesService.getAllGamesWithImagesData());
        });

        this.router.post(`/newGame`, async (req: Request, res: Response) => {
            const newGame = req.body;
            if (await this.gamesService.addGame(newGame)) {
                res.sendStatus(StatusCodes.CREATED);
            } else {
                res.sendStatus(StatusCodes.BAD_REQUEST);
            }
        });

        this.router.delete(`/:gameName`, async (req: Request, res: Response) => {
            res.json(await this.gamesService.deleteGame(req.params.gameName));
        });
    }
}
