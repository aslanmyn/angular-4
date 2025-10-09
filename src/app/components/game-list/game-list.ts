import { Component, signal } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

import { GamesService } from '../../services/game.service';
import type { Game } from '../../services/games';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './game-list.html',
  styleUrls: ['./game-list.css']
})
export class GameListComponent {
  games = signal<Game[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);


  constructor(private api: GamesService) {}

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

  trackId = (_: number, g: Game) => g.id;
}
