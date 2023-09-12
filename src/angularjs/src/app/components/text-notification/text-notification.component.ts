import { Component, Input } from '@angular/core';
import { NotificationI } from 'src/app/interfaces/notification.interface';

@Component({
  selector: 'app-text-notification',
  templateUrl: './text-notification.component.html',
  styleUrls: ['./text-notification.component.scss'],
})
export class TextNotificationComponent {
	@Input() notif: NotificationI = {id: -1, type: 0, data: {}};


}