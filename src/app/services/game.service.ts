import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import type { Game } from './games';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private http = inject(HttpClient);

  private readonly url =
    'https://corsproxy.io/?https://www.freetogame.com/api/games';

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.url);
  }


  searchGames(query: string): Observable<Game[]> {
    const q = (query ?? '').trim().toLowerCase();
    if (!q) {
      return this.getGames();
    }
    return this.http.get<Game[]>(this.url).pipe(
      map((list) =>
        (list ?? []).filter((g) => {
          const hay = `${g.title} ${g.genre} ${g.platform} ${g.publisher}`.toLowerCase();
          return hay.includes(q);
        })
      )
    );

  }
}
