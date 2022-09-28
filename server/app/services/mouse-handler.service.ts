import { Position } from '@common/position';
import { ImageDataToCompare } from '@common/differences-classes/image-data-to-compare'
import { Service } from 'typedi';

@Service()
export class MouseHandlerService {

  mousePosition: Position;
  differencesHashmap: Map <number, number>;
  differencesNumberFound: Array <number>;

  constructor(readonly imageDataToCompare: ImageDataToCompare) {
    this.mousePosition = { x: 0, y: 0 };
    this.differencesHashmap = new Map<number, number>();
    this.differencesNumberFound = [];
  }

  isValidClick(mousePosition:Position): boolean{
    console.log('service check');
    return true;
  }

  // Sauvegarder la hashmap de diff dans le games.json
  // Par contre la méthode devrait être ici ou dans diff-detector ??
  saveHashMapInJson(){}

  loadHashMapFromJson() {}

  convertMousePositionToPixelNumber(): number {
    return ((this.mousePosition.x + 1)*this.imageDataToCompare.imageWidth
     + this.mousePosition.y - this.imageDataToCompare.imageWidth)
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
