
import { Observable } from 'rxjs';

export interface MouseObservable {
    downEvent:Observable<MouseEvent>,
    moveEvent:Observable<MouseEvent>,
    upEvent:Observable<MouseEvent>,
    leaveEvent:Observable<MouseEvent>,
}
