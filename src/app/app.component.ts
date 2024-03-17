import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from './services/user.service';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NzNotificationModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {

  constructor(
    public auth: AuthService,
    private userService: UserService,
    private notification: NzNotificationService,
    private router: Router
  ){
    
  }

  title = 'escape-pursuit-ui';
  ngOnInit() {

    this.auth.user$.subscribe((user) => {
      if (!user) {
        return;
      }
      if (!user.sub) {
        return;
      }
      this.userService.userCallback(user.sub).subscribe((res) => {
        this.notification.create(
          'success',
          'User Logged In',
          'You have successfully logged in'
        );
        if (window.location.pathname === '/') {
          this.router.navigate(['/rooms']);
        }
      });
    });
  }
}
