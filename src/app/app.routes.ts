import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { RoomsComponent } from './rooms/rooms.component'
import { LobbyComponent } from './lobby/lobby.component'
import { GameComponent } from './game/game.component'
import { GameCreateComponent } from './game-create/game-create.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        pathMatch: 'full',
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'game-create',
        component: GameCreateComponent,
    },
    {
        path: 'lobby/:id',
        component: LobbyComponent,
    },
    {
        path: 'game/:id',
        component: GameComponent,
    },
    {
        path: 'rooms',
        component: RoomsComponent,
        canActivate: [AuthGuard],
    },
    {
        path: '**',
        redirectTo: '/',
    }
];