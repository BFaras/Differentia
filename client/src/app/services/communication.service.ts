import { HttpClient } from '@angular/common/http';
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

    basicGet(): Observable<Message> {
        return this.http.get<Message>(`${this.baseUrl}/example`).pipe(catchError(this.handleError<Message>('basicGet')));
    }

    basicPost(time: Message): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/example/send`, time).pipe(catchError(this.handleError<void>('basicPost')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        console.log("ntm");
        return () => of(result as T);
    }

    getGames(): Observable<Array<Game>> {
        return this.http.get<Array<Game>>(`${this.baseUrl}/games`).pipe(catchError(this.handleError<Array<Game>>('getGames')));
    }

    addGame(game: Game): Observable<Number>{
        return this.http.post<Number>(`${this.baseUrl}/games/newGame`, game)
        .pipe(catchError(this.handleError<Number>('addGame')));    
    }
}
