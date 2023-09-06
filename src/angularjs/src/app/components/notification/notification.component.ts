import { Component, ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef } from '@angular/core';
import { FlatButtonComponent } from '../flat-button/flat-button.component';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  
  FlatButtonComponent = FlatButtonComponent;
  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}

  displayNotification(component: any, data: any) {
    const container = document.getElementById('container');
    const elem = document.createElement('div');
    const factory = this.resolver.resolveComponentFactory(component);
    const componentRef = factory.create(this.injector, [], elem) as ComponentRef<any>;
    // componentRef.instance.data = data;
    this.appRef.attachView(componentRef.hostView);
    if (container)
    {
      container.appendChild(elem);
      setTimeout(() => {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
        container.removeChild(elem);
      }, 5000);
    }
  }
}
