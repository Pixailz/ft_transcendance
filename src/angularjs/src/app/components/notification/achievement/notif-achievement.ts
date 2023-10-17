import { Component, Input } from '@angular/core';
import { DefNotificationI, NotificationI } from 'src/app/interfaces/notification.interface';

@Component({
	selector: 'app-achievement-notif',
	templateUrl: './notif-achievement.html',
	styleUrls: ['./notif-achievement.scss']
})
export class NotifAchievementComponent {
	@Input() notif: NotificationI = DefNotificationI;
}
