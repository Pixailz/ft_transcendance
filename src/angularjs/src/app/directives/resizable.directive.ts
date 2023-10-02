import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResizable]'
})
export class ResizableDirective {
	private isResizing = false;
	private initialX = 0;
	private initialWidth = 0;

	constructor(private el: ElementRef, private renderer: Renderer2) { }

	@HostListener('mousedown', ['$event'])
	onMouseDown(event: MouseEvent) {
		const resizeHandleWidth = 10;

		if (event.offsetX >= this.el.nativeElement.offsetWidth - resizeHandleWidth) {
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
			
			console.log(newWidth);
		
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