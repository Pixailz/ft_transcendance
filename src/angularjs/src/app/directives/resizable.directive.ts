import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, HostListener, Renderer2, ViewContainerRef } from '@angular/core';
import { ResizableHandleComponent } from '../components/resizable-handle/resizable-handle.component';

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective {
	isResizing: boolean = false;
	initialX: number = 0;
	initialWidth: number = 0;
	resizeHandleWidth: number = 10;
	handle!: ComponentRef<ResizableHandleComponent>;
	constructor(
		private viewContainerRef: ViewContainerRef,
		private el: ElementRef,
		private renderer: Renderer2,
		private resolver: ComponentFactoryResolver,
		) { }

	ngOnInit() {
		let factory = this.resolver.resolveComponentFactory(ResizableHandleComponent);
		this.handle = this.viewContainerRef.createComponent(factory);
		this.handle.instance.height = this.el.nativeElement.height;
	}

	@HostListener('document:mousedown', ['$event'])
	onMouseDown(event: MouseEvent) {
		if (this.handle.instance.elRef.nativeElement === event.target) {
			this.isResizing = true;
			this.initialX = event.clientX;
			this.initialWidth = this.el.nativeElement.offsetWidth;
		}
	}

	@HostListener('document:mousemove', ['$event'])
	onMouseMove(event: MouseEvent) {
		if (this.isResizing) {
			const newWidth = this.initialWidth + (event.clientX - this.initialX);
			const containerWidth = this.el.nativeElement.parentElement.offsetWidth;


			if (newWidth <= containerWidth) {
				this.renderer.setStyle(this.el.nativeElement, 'width', `${newWidth}px`);
			}
		}
	}

	@HostListener('document:mouseup')
	onMouseUp() {
		this.isResizing = false;
	}
}
