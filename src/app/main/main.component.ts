import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '@auth0/auth0-angular';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ NzLayoutModule, NzPageHeaderModule, NzButtonModule, NzCardModule, NzInputModule,  NzGridModule, NzNotificationModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.less'
})
export class MainComponent {

  constructor(
    public auth: AuthService,
    private notification: NzNotificationModule
  ){
    
  }

}
