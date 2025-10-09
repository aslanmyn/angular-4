import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Game } from './games';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private http = inject(HttpClient);


  private readonly url =
    'https://corsproxy.io/?https://www.freetogame.com/api/games';

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.url);
  }
}
