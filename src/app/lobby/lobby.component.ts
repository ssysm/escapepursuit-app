import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  RouterOutlet,
  RouterModule,
  Router,
} from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '@auth0/auth0-angular';
import {
  NzNotificationModule,
  NzNotificationService,
} from 'ng-zorro-antd/notification';
import { Firestore, doc, onSnapshot, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [
    NzLayoutModule,
    RouterModule,
    NzPageHeaderModule,
    RouterModule,
    NzButtonModule,
    NzCardModule,
    NzInputModule,
    NzGridModule,
    NzNotificationModule,
    NzTableModule,
    CommonModule,
  ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.less',
})
export class LobbyComponent implements OnInit, OnDestroy {
  public gameData: any;
  public currentUser: User | null | undefined = null;
  public players = [];
  public host: any;

  private unsub: any;

  constructor(
    private http: HttpClient,
    private auth0: AuthService,
    private notification: NzNotificationService,
    private firestore: Firestore,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.auth0.user$.subscribe((user) => {
      this.currentUser = user;
      this.fetchGame();
      this.joinPlayer();
      setDoc(
        doc(this.firestore, 'games', this.activeRoute.snapshot.params['id']),
        {
          playerChange: Math.random(),
        },
      );
      //this.whoHost();
    });

    this.unsub = onSnapshot(
      doc(this.firestore, 'games', this.activeRoute.snapshot.params['id']),
      (doc: any) => {
        const data = doc.data();
        if (data['status'] === 'STARTED') {
          this.router.navigate(['/game/' + this.activeRoute.snapshot.params['id']]);
          return;
        }
        this.fetchGame();
      }
    );
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  // whoHost = () => {
  //   if (this.gameData['hostId'] === this.currentUser?.sub) {
  //     this.host = true;
  //   } else {
  //     this.host = false;
  //   }

  //};

  fetchGame = () => {
    // POST function
    this.http
      .get(
        environment.API_HOST +
          '/api/games/' +
          this.activeRoute.snapshot.params['id']
      )
      .subscribe((res: any) => {
        this.gameData = res['game'];
        this.players = res['game']['players'];

        if (res['game']['hostId'] === this.currentUser?.sub) {
          this.host = true;
        } else {
          this.host = false;
        }
      });
  };

  joinPlayer = () => {
    // POST function
    this.http
      .post(
        environment.API_HOST +
          '/api/games/' +
          this.activeRoute.snapshot.params['id'] +
          '/players',
        {
          player: this.currentUser?.sub,
        }
      )
      .subscribe(
        (res: any) => {
          this.fetchGame();
          this.notification.create(
            'success',
            'Player Joined',
            'You have successfully joined the game'
          );
        },
        (error) => {
          this.notification.create(
            'error',
            'Error',
            'You have already joined the game'
          );
        }
      );
  };

  playerLeave = () => {
    setDoc(
      doc(this.firestore, 'games', this.activeRoute.snapshot.params['id']),
      {
        playerChange: Math.random(),
      },
    );

    // POST function
    this.http
      .post(
        environment.API_HOST +
          '/api/games/' +
          this.activeRoute.snapshot.params['id'] +
          '/players/' +
          encodeURIComponent(this.currentUser?.sub || ''),
        {}
      )
      .subscribe((res: any) => {
        this.fetchGame();
        this.notification.create(
          'success',
          'Player Left',
          'You have successfully left the game'
        );
        this.router.navigate(['/rooms']);
      });
  };

  startGame = () => {
    // POST function
    this.http
      .post(
        environment.API_HOST +
          '/api/games/' +
          this.activeRoute.snapshot.params['id'],
        {}
      )
      .subscribe((res: any) => {
        this.notification.create(
          'success',
          'Game Started',
          'The game has started'
        );
        setDoc(
          doc(this.firestore, 'games', this.activeRoute.snapshot.params['id']),
          {
            status: 'STARTED',
          },
        );
        this.router.navigate([
          '/game/' + this.activeRoute.snapshot.params['id'],
        ]);
      });
  };
}
