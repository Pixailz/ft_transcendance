import { Component } from '@angular/core';
import { slideInAnimation } from '../animations';

@Component({
  selector: 'app-authenticated-layout',
  templateUrl: './authenticated-layout.component.html',
  styleUrls: ['./authenticated-layout.component.scss'],
  animations: [ slideInAnimation ]
})
export class AuthenticatedLayoutComponent {
}