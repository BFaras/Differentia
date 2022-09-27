import { MouseHandlerService } from '@app/services/mouse-handler.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class MouseController {
    router: Router;
    constructor(private mouseService: MouseHandlerService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post(`/`, async (req: Request, res: Response) => {
            const mouseEvent: MouseEvent = req.body;
            console.log('controller check');
            res.json(this.mouseService.mouseHitDetect(mouseEvent));
        });
    }
}
