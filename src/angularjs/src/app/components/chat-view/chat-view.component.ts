import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-chat-view',
	templateUrl: './chat-view.component.html',
	styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent {
	messageLength: number = 0;
	messageForm!: FormGroup;

	constructor(
		private formBuilder: FormBuilder
	) {}

	async ngOnInit() {
		this.messageForm = this.formBuilder.group({
			message: ""
		}, { updateOn: "change" });

		this.messageForm.get('message')!.valueChanges
		.subscribe((value: any) => {
			this.messageLength = value.length;
		});
	}
}
