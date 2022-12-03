import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class ImagesController {
    router: Router;

    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', (req: Request, res: Response) => {
            if (req['files']) {
                const sampleFile = req['files'].file;
                const filePath = './assets/images/' + sampleFile.name;
                sampleFile.mv(filePath);
                res.sendStatus(StatusCodes.CREATED);
            } else {
                res.sendStatus(StatusCodes.BAD_REQUEST);
            }
        });
    }
}
