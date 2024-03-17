import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  // User Callback to upsert Auth0 user
  userCallback(auth0Id: string) {
    return this.http.post(environment.API_HOST + '/api/users/callback', { auth0Id });
  }
}
