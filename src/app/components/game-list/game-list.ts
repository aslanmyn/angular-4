import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

import { GamesService } from '../../services/game.service';
import type { Game } from '../../services/games';

import { Subject, of, Subscription } from 'rxjs';
import { distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './game-list.html',
  styleUrls: ['./game-list.css']
})
export class GameListComponent implements OnInit, OnDestroy {
  games = signal<Game[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);


  q = signal('');


  private search$ = new Subject<string>();
  private sub = new Subscription();

  constructor(private api: GamesService) {}

  ngOnInit(): void {

    const s = this.search$
      .pipe(
        distinctUntilChanged(),
        switchMap((query) =>
          this.api.searchGames(query).pipe(
            catchError((err) => {
              console.error(err);
              this.error.set('Failed to search');
              return of([] as Game[]);
            })
          )
        )
      )
      .subscribe((list) => {
        this.error.set(null);
        this.games.set(list);
        this.loading.set(false);
      });

    this.sub.add(s);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getGames().subscribe({
      next: (data: Game[]) => {
        this.games.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error(err);
        this.error.set('Failed to load games');
        this.loading.set(false);
      }
    });
  }


  onSearchCommit(query: string): void {
    this.loading.set(true);
    this.search$.next((query ?? '').trim());
  }

  trackId = (_: number, g: Game) => g.id;
}
