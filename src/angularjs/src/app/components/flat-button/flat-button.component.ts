import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-flat-button',
  templateUrl: './flat-button.component.html',
  styleUrls: ['./flat-button.component.scss']
})
export class FlatButtonComponent {
	@Input() fontIcon: string = '';
	@Input() bgColor: string = '';
	@Input() color: string = '';
	@Input() isActive: boolean = false;
	@Input() isDisabled: boolean = false;
}