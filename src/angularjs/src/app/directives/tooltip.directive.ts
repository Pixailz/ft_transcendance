import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { UserTooltipComponent } from '../components/user-tooltip/user-tooltip.component';
import { UserI } from '../interfaces/user.interface';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {

  @Input() user!: UserI
  displayTooltip = false;

  constructor(
    private el: ElementRef,
		private resolver: ComponentFactoryResolver,
		private viewContainerRef: ViewContainerRef,
  ) {

    let tooltip: ComponentRef<UserTooltipComponent>;

    this.el.nativeElement.parentElement.addEventListener("mouseenter", () => {
      if (!this.displayTooltip)
      {
        let factory = this.resolver.resolveComponentFactory(UserTooltipComponent);
        tooltip = this.viewContainerRef.createComponent(factory);
        tooltip.instance.user = this.user;
        this.displayTooltip = true;
      }
    });

    this.el.nativeElement.parentElement.addEventListener("mouseleave", () => {
      if (this.displayTooltip)
      {
        tooltip.destroy();
        this.displayTooltip = false;
      }
    });
  }
}
