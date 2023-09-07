import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-notification',
  templateUrl: './text-notification.component.html',
  styleUrls: ['./text-notification.component.scss'],
})
export class TextNotificationComponent {
	@Input() data = {message: ''};
}