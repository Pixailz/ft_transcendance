import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { slideInAnimation } from '../animations';
import { RouterOutlet } from '@angular/router';
import { WSGateway } from '../services/ws.gateway';

@Component({
	selector: 'app-authenticated-layout',
	templateUrl: './authenticated-layout.component.html',
	styleUrls: ['./authenticated-layout.component.scss'],
	animations: [ slideInAnimation ]
})
export class AuthenticatedLayoutComponent implements AfterViewInit{
  constructor(
    private changeRef: ChangeDetectorRef,
    private wsGateway: WSGateway) {}

  ngAfterViewInit(): void {
    this.changeRef.detectChanges();
  }

  ngOnInit() {
    this.wsGateway.socket.connect();
  }

  prepareRoute(outlet: RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
