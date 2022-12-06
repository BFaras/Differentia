import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from '@common/game';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    numberOfDifferences: number;
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}

    getGames(): Observable<Game[]> {
        return this.http.get<Game[]>(`${this.baseUrl}/games`).pipe(catchError(this.handleError<Game[]>('getGames')));
    }

    addGame(game: Game): Observable<HttpResponse<any>> {
        const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
        return this.http
            .post(`${this.baseUrl}/games/newGame`, game, { observe: 'response', responseType: 'text', headers: headers })
            .pipe(catchError(this.handleError<HttpResponse<any>>('addGame')));
    }

    deleteGame(gameName: string): Observable<Game[]> {
        return this.http.delete<Game[]>(`${this.baseUrl}/games/${gameName}`).pipe(catchError(this.handleError<Game[]>('deleteGame')));
    }

    uploadFiles(formData: FormData): Observable<Object> {
        return this.http.post(`${this.baseUrl}/images`, formData).pipe(catchError(this.handleError<Object>('uploadFiles')));
    }
    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
