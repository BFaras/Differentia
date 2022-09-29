import { Position } from '@common/position';
import { ImageDataToCompare } from '@common/image-data-to-compare'
import { Service } from 'typedi';
import { DifferenceDetectorService } from './difference-detector.service';
import { Request, Response, Router } from 'express';

@Service()
export class MouseHandlerService {

  differencesHashmap: Map <number, number>;
  differencesNumberFound: Array <number>;
  router: Router;
  imagesData: ImageDataToCompare;

  constructor(readonly imagesDataToCompare: ImageDataToCompare) {
    this.differencesHashmap = new Map<number, number>();
    this.differencesNumberFound = [];

    this.configureRouter();
    this.generateDifferencesHashmap();

  }

  private configureRouter(): void {
    this.router = Router();
    
    this.router.post(`/imagesdata`, (req: Request, res: Response) => {
      this.imagesData = req.body;
    });
  }

  isValidClick(mousePosition:Position): boolean{
    console.log(mousePosition);

    return this.validateDifferencesOnClick(mousePosition);
  }

  generateDifferencesHashmap() {
    this.differencesHashmap = new DifferenceDetectorService(this.imagesData).getPixelsDifferencesNbMap();

  }

  convertMousePositionToPixelNumber(mousePosition: Position): number {
    return ((mousePosition.x + 1)*this.imagesDataToCompare.imageWidth
     + mousePosition.y - this.imagesDataToCompare.imageWidth)
  }

  validateDifferencesOnClick(mousePosition: Position): boolean {
    const pixelNumber = this.convertMousePositionToPixelNumber(mousePosition);
    let differencesNumber: number;
    let pixelIsDifferent: boolean = true;

    if (this.differencesHashmap.has(pixelNumber)) {
      differencesNumber = this.differencesHashmap.get(pixelNumber)!;

      if (this.differencesNumberFound.includes(differencesNumber)) {
        // La différence a déjà été trouvée précédemment
        return (!pixelIsDifferent);
      }
      else {
        // Nouvelle Différence trouvée
        this.differencesNumberFound.push(differencesNumber);
        return pixelIsDifferent;
      }
    }
    else {
      // Afficher Erreur et suspendre/ignorer les clics pendant 1s
      return (!pixelIsDifferent);
    }
  }
}
