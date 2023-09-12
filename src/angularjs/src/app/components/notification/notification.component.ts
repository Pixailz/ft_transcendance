import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ElementRef, Injectable, Injector, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { WSGateway } from 'src/app/services/ws.gateway';
import { TextNotificationComponent } from '../text-notification/text-notification.component';
import { FriendReqComponent } from '../friend-req/friend-req.component';
import { NotificationType } from 'src/app/interfaces/notification.interface';
import { NotificationI } from 'src/app/interfaces/notification.interface';


@Component({
	animations: [
	 trigger(
	   'enterAnimation', [

		 transition('void <=> *', animate(0)),

		 transition(':enter', [
		   style({transform: 'translateX(100%)'}),
		   animate('300ms', style({transform: 'translateX(0)'}))
		 ]),
		 transition(':leave', [
		   style({transform: 'translateX(0)'}),
		   animate('300ms', style({transform: 'translateX(100%)'}))
		 ])
	   ]
	 )
   ],
   selector: 'app-notification',
   templateUrl: './notification.component.html',
   styleUrls: ['./notification.component.scss'],
 })
export class NotificationComponent implements OnInit {
	@ViewChild('container', { static: true, read: ViewContainerRef })
		container!: ViewContainerRef;


	constructor (
		private renderer: Renderer2,
	) {}

	ngOnInit() {
	}

	displayNewNotification(notification: NotificationI) {
		let component: ComponentRef<any> | null = null;
		switch (notification.type) {
			case NotificationType.NOTSET:
				component = this.container.createComponent(TextNotificationComponent);
				break;
			case NotificationType.FRIENDREQUEST:
				component = this.container.createComponent(FriendReqComponent);
				break;
			default:
				break;
		}
		if (!component)
			return;
		component.instance.data = notification.data;
		this.renderer.addClass(component.location.nativeElement, 'notification');
	  	setTimeout(() => {
			this.container.remove(0);
		}, 5000);
	}


    displayNotification(message: string) {
      const container = document.getElementById('container');
      const elem = this.renderer.createElement('div');
      const text = this.renderer.createText(message);
      this.renderer.appendChild(elem, text);
      this.renderer.addClass(elem, 'notification');
      this.renderer.appendChild(container, elem);
      setTimeout(() => {
        this.renderer.removeChild(container, elem);
      }, 5000);
    }
}
