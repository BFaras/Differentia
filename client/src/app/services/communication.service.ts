import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '@common/message';
import { Game } from '@common/game'
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

    // pas utiliser dans le code ==> donc à enlever par la suite
    basicGet(): Observable<Message> {
        return this.http.get<Message>(`${this.baseUrl}/example`).pipe(catchError(this.handleError<Message>('basicGet')));
    }

    // pas utiliser dans le code ==> donc à enlever par la suite
    basicPost(time: Message): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/example/send`, time).pipe(catchError(this.handleError<void>('basicPost')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }

    getGames(): Observable<Array<Game>> {
        return this.http.get<Array<Game>>(`${this.baseUrl}/games`).pipe(catchError(this.handleError<Array<Game>>('getGames')));
    }

    addGame(game: Game): Observable<HttpResponse<any>>{
        return this.http.post(`${this.baseUrl}/games/newGame`, game, {observe: 'response', responseType: 'text'} ).pipe(catchError(this.handleError<HttpResponse<any>>('addGame')));    
    }
}
