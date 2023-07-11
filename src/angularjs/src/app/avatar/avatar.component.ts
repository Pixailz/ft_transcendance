import { Component } from '@angular/core';

@Component({
	selector: 'app-avatar',
	templateUrl: './avatar.component.html',
	styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
	public	file: string = '';

	onFileChange(event: any) {
		const files = event.target.files as FileList;
	
		if (files.length > 0) {
			const _file = URL.createObjectURL(files[0]);
			this.file = _file;
			this.resetInput();   
		}
	}

	resetInput(){
		const input = document.getElementById('avatar-input-file') as HTMLInputElement;
		if (input) {
			input.value = '';
		}
	}
}
