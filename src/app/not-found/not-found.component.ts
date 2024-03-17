import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzResultModule } from 'ng-zorro-antd/result';
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [NzResultModule, CommonModule  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.less'
})
export class NotFoundComponent {

}
