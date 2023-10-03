import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-resizable-handle',
  template: '',
  styleUrls: ['./resizable-handle.component.scss']
})
export class ResizableHandleComponent {
  constructor(
    private elRef: ElementRef,
		private renderer: Renderer2,
  ) {}
    @Input() height: number = 0;
    @Input() width: number = 0;

  ngOnInit() {
    this.renderer.setStyle(this.elRef.nativeElement, 'height', this.height + 'px');
    this.renderer.setStyle(this.elRef.nativeElement, 'width', this.width + 'px');
  }
}
