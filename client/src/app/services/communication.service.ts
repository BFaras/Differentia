import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from '@common/game';
import { TimeConstants } from '@common/time-constants';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private readonly baseUrl: string = environment.serverUrl;
    numberOfDifferences: number;

    constructor(private readonly http: HttpClient) {}

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }

    getGames(): Observable<Array<Game>> {
        return this.http.get<Array<Game>>(`${this.baseUrl}/games`).pipe(catchError(this.handleError<Array<Game>>('getGames')));
    }

    addGame(game: Game): Observable<HttpResponse<any>> {
        return this.http
            .post(`${this.baseUrl}/games/newGame`, game, { observe: 'response', responseType: 'text' })
            .pipe(catchError(this.handleError<HttpResponse<any>>('addGame')));
    }

    deleteGame(gameName: string): Observable<Array<Game>> {
        return this.http.delete<Array<Game>>(`${this.baseUrl}/games/${gameName}`).pipe(catchError(this.handleError<Array<Game>>('deleteGame')));
    }

    uploadFiles(formData: FormData): Observable<Object> {
        return this.http.post(`${this.baseUrl}/images`, formData).pipe(catchError(this.handleError<Object>('uploadFiles')));
    }
    addTimeConstants(time: TimeConstants): Observable<Object> {
        return this.http.post(`${this.baseUrl}/times`, time).pipe(catchError(this.handleError<Object>('addTimeConstants')));
    }
}
