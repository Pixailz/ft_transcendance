import { ComponentFactoryResolver, Directive, ElementRef, HostListener, Renderer2, ViewContainerRef } from '@angular/core';
import { ResizableHandleComponent } from '../components/resizable-handle/resizable-handle.component';

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective {
	private isResizing: boolean = false;
	private initialX: number = 0;
	private initialWidth: number = 0;
	private resizeHandleWidth: number = 10;
	constructor(
		private viewContainerRef: ViewContainerRef,
		private el: ElementRef,
		private renderer: Renderer2,
		private resolver: ComponentFactoryResolver,
		) { }

	ngOnInit() {
		let factory = this.resolver.resolveComponentFactory(ResizableHandleComponent);
		let handle = this.viewContainerRef.createComponent(factory);
		handle.instance.height = this.el.nativeElement.height;
		handle.instance.width = this.resizeHandleWidth;
	}

	@HostListener('document:mousedown', ['$event'])
	onMouseDown(event: MouseEvent) {
		console.log(event.offsetX);

		if (event.offsetX >= this.el.nativeElement.offsetWidth - this.resizeHandleWidth) {
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
