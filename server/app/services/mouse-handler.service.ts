import { Position } from '@common/position';
import { ImageDataToCompare } from '@common/differences-classes/image-data-to-compare'
import { Service } from 'typedi';
import { DifferenceDetectorService } from './difference-detector.service';

@Service()
export class MouseHandlerService {

  mousePosition: Position;
  differencesHashmap: Map <number, number>;
  differencesNumberFound: Array <number>;

  constructor(readonly imagesDataToCompare: ImageDataToCompare) {
    this.mousePosition = { x: 0, y: 0 };
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

  convertMousePositionToPixelNumber(): number {
    return ((this.mousePosition.x + 1)*this.imagesDataToCompare.imageWidth
     + this.mousePosition.y - this.imagesDataToCompare.imageWidth)
  }

  validateDifferencesOnClick() {
    const pixelNumber = this.convertMousePositionToPixelNumber();
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
