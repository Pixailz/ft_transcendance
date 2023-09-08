import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, HostBinding } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})

export class AppComponent {
	@HostBinding('class') className = 'darkMode';
	title = 'transcendence';

	constructor(private overlay: OverlayContainer){
		this.overlay.getContainerElement().classList.add('darkMode');
	}
}
