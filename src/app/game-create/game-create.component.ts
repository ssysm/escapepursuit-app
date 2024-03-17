import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { GoogleMap, MapMarker, MapCircle } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '@auth0/auth0-angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-game-create',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzPageHeaderModule,
    NzButtonModule,
    RouterModule,
    NzCardModule,
    FormsModule,
    NzInputModule,
    NzGridModule,
    NzTableModule,
    FormsModule,
    GoogleMap,
    MapMarker,
    MapCircle,
    CommonModule,
  ],
  templateUrl: './game-create.component.html',
  styleUrl: './game-create.component.less',
})
export class GameCreateComponent implements OnInit {
  [x: string]: any;
  apiUrl = environment.API_HOST + '/api/games';

  userData: User | undefined | null = null;
  lobbyName: any;

  constructor(private http: HttpClient, private auth0: AuthService,
    private router: Router
    ) {}

  lobby_name: string = '';

  create_game(): void {
    this.http
      .post(environment.API_HOST + '/api/games', {
        name: this.lobby_name,
        hostId: this.userData?.sub,
      })
      .subscribe((res: any) => {
        this.router.navigate(['/lobby', res['game']['id']]);
      });
  }

  ngOnInit(): void {
    this.auth0.user$.subscribe((user) => {
      this.userData = user;
    });
  }
}
