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

	// async ngOnInit() {
	// 	this.messageForm = this.formBuilder.group({
	// 		message: content
	// 	}, { updateOn: "change" });

	// 	this.messageForm.get('content')?.valueChanges
	// 	.pipe(pairwise())
	// 	.subscribe(([prev, next]: [any, any]) => {
	// 		this.invalidNickname = false;
	// 	});
	// }
}
