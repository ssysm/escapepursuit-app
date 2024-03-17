import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService, User } from '@auth0/auth0-angular';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet, RouterModule, Router } from '@angular/router';

// @Component({
//     selector: 'app-profile',
//     standalone: true,
//     imports: [],
//     templateUrl: './profile.component.html',
//     styleUrl: './profile.component.less'
//   })
//   export class profileComponent {
  
//   }
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NzLayoutModule, NzPageHeaderModule, NzButtonModule, NzInputModule, NzGridModule, NzNotificationModule, CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less'
})
export class ProfileComponent {
  public currentUser: User | null | undefined = null;
  public nameID: string | null = null;

  constructor(private auth0: AuthService) {}

  ngOnInit(): void {
    this.auth0.user$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.nameID = user.sub ?? null; // Accessing user ID directly
      }
    });
  }
}
