import { Component, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';
interface Player {
  id: string;
  gameId: string;
  userId: string;
  role: string;
  latitude: number | null;
  longitude: number | null;
  radius: number | null;
  score: number;
}

interface Game {
  id: string;
  name: string;
  hostId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  players: Player[];
}

interface ApiResponse {
  success: boolean;
  games: Game[];
}

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzCardModule,
    NzInputModule,
    NzGridModule,
    NzTableModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.less',
})
export class RoomsComponent {
  apiUrl = environment.API_HOST + '/api/games';
  tableData: Game[] = [];

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private http: HttpClient,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http
      .get<ApiResponse>(this.apiUrl, {
        params: {
          openOnly: true,
        },
      })
      .subscribe(
        (data: ApiResponse) => {
          this.tableData = data.games;
        },
        (error: any) => {
          console.error('Error fetching data:', error);
        }
      );
  }
}
