import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { GoogleMap, MapMarker, MapCircle } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { Firestore, doc, onSnapshot, setDoc } from '@angular/fire/firestore';
import { AuthService, User } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import {
  NzNotificationModule,
  NzNotificationService,
} from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzCardModule,
    NzInputModule,
    NzGridModule,
    CommonModule,
    NzTableModule,
    GoogleMap,
    MapMarker,
    MapCircle,
    NzNotificationModule,
    RouterModule,
    NzModalModule,
    FormsModule,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.less',
})
export class GameComponent implements OnInit, OnDestroy {
  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  hiderValue: string = '';
  gameId: string = '';
  userData: User | undefined | null = null;
  gameData: any = null;
  hider_id: string = '';
  currentUserRole: string = 'UNKNOWN';

  unsub: any;

  center: google.maps.LatLngLiteral = { lat: 1, lng: 1 };
  zoom = 14; // Adjust the zoom level as needed
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];
  circleCenter: google.maps.LatLngLiteral = { lat: 1, lng: 1 };
  radius = 500; // Adjust the radius of the circle as needed
  mapOptions: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    maxZoom: 15,
    minZoom: 8,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }],
      },
    ],
  };

  locationReportInterval: number = 0;

  constructor(
    private firestore: Firestore,
    private auth0: AuthService,
    private activedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  checkHiderValue() {
    this.http
      .post(
        environment.API_HOST +
          '/api/games/' +
          this.activedRoute.snapshot.params['id'] +
          '/players/' +
          this.hider_id +
          '/players',
        {
          gameId: this.activedRoute.snapshot.params['id'],
          caughtPlayerGameId: this.hider_id,
        }
      )
      .subscribe((res: any) => {
        if (res['success'] === true) {
          this.notification.create(
            'success',
            'Player caught',
            'You have successfully caught the player'
          );
          setDoc(
            doc(
              this.firestore,
              `games/${this.gameId}`
            ),
            { status: 'ENDED' },
          );
          this.router.navigate([
            '/lobby',
            this.activedRoute.snapshot.params['id'],
          ]);
        } else {
          this.notification.create(
            'error',
            'Player not found',
            'The player you are trying to catch is not found'
          );
        }
      });
  }

  ngOnInit() {
    // Initialize the map with the current location as the center
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Set the marker position to the current location
          this.markerPositions.push(this.center);

          // Set the circle center to the current location
          this.circleCenter = this.center;
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    this.auth0.user$.subscribe((user) => {
      this.userData = user;
    });

    this.gameId = this.activedRoute.snapshot.params['id'];
    this.fetchGameData();
    setInterval(this.geolocationIntervalCallback, 5 * 1000);

    this.unsub = onSnapshot(
      doc(this.firestore, `games/${this.gameId}`),
      (doc: any) => {
       const data = doc.data();
       if (data['status'] === 'ENDED') {
        this.notification.create(
          'info',
          'Game Ended',
          'The game has ended'
        );
         this.router.navigate(['/lobby', this.gameId]);
       }
      }
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.locationReportInterval);
  }

  fetchGameData = () => {
    // Fetch game data from the database
    this.http
      .get(environment.API_HOST + '/api/games/' + this.gameId)
      .subscribe((res: any) => {
        this.gameData = res['game'];
        this.gameData['players'].forEach((player: any) => {
          if (player['userId'] === this.userData?.sub) {
            this.currentUserRole = player['role'];
            this.hider_id = player['assignNum'];
          }
        });
      });
  };

  geolocationIntervalCallback = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Set the marker position to the current location
          this.markerPositions[0] = this.center;

          // Set the circle center to the current location
          this.circleCenter = this.center;

          if (!this.userData) {
            console.error('User data not available');
            return;
          }

          setDoc(
            doc(
              this.firestore,
              `games/${this.gameId}/players/${this.userData.sub}`
            ),
            this.center
          );
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  circleOptions: google.maps.CircleOptions = {
    strokeColor: '#FFFFFF',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '##0000FF',
    fillOpacity: 0.35,
    center: this.circleCenter,
    radius: this.radius,
  };
}
