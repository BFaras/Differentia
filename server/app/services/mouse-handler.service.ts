import { Position } from '@common/position';
import { ImageDataToCompare } from '@common/image-data-to-compare'
import { Service } from 'typedi';
import { DifferenceDetectorService } from './difference-detector.service';

@Service()
export class MouseHandlerService {

  differencesHashmap: Map <number, number>;
  differencesNumberFound: Array <number>;

  constructor(readonly imagesDataToCompare: ImageDataToCompare) {
    this.differencesHashmap = new Map<number, number>();
    this.differencesNumberFound = [];

    this.generateDifferencesHashmap(imagesDataToCompare);
  }

  isValidClick(mousePosition:Position): boolean{
    console.log(mousePosition);
    //Il faut que la fonction de Validation renvoie un boolean si possible
    return false;
  }

  generateDifferencesHashmap(imagesData: ImageDataToCompare) {
    this.differencesHashmap = new DifferenceDetectorService(imagesData).getPixelsDifferencesNbMap();

  }

  convertMousePositionToPixelNumber(mousePosition: Position): number {
    return ((mousePosition.x + 1)*this.imagesDataToCompare.imageWidth
     + mousePosition.y - this.imagesDataToCompare.imageWidth)
  }

  validateDifferencesOnClick(mousePosition: Position) {
    const pixelNumber = this.convertMousePositionToPixelNumber(mousePosition);
    let differencesNumber: number;

    if (this.differencesHashmap.has(pixelNumber)) {
      differencesNumber = this.differencesHashmap.get(pixelNumber)!;

      if (this.differencesNumberFound.includes(differencesNumber)) {
        // La différence a déjà été trouvée précédemment
        return;
      }
      else {
        // Nouvelle Différence trouvée
        this.differencesNumberFound.push(differencesNumber);

      }
    }
    else {
      // Afficher Erreur et suspendre/ignorer les clics pendant 1s
      return;
    }
  }
}
