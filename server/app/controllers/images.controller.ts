
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Service } from 'typedi';
const fileUpload = require('express-fileupload')
// const HTTP_STATUS_CREATED = 201;

@Service()
export class ImagesController {
    router: Router;

    constructor() {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        
        this.router.post('/',fileUpload({createParentPath:true}) ,(req: Request, res: Response) => {
            let sampleFile = req['files'].file;
            const filePatth = './assets/images/' + sampleFile.name;
            sampleFile.mv(filePatth, (err:any)=>{
                if(err){
                    console.log('erreur')
                }

            })
            res.sendStatus(StatusCodes.CREATED)
        });

    }
}
