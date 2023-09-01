import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-avatar',
	templateUrl: './avatar.component.html',
	styleUrls: ['./avatar.component.scss'],
	providers: [
		{ 
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: AvatarComponent
		}
	]
})
export class AvatarComponent implements OnInit, ControlValueAccessor{
	public	file: string = '';

	onChange: any = () => {};
	onTouched: any = () => {};

	constructor() { }

	writeValue(obj: string): void {
		this.file = obj;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	ngOnInit(): void { }

	onFileChange(event: any) {
		const files = event.target.files as FileList;
	
		if (files.length > 0) {
			const file = files[0];
			if (file.size > 100000) {
				alert('File is too large. Max size is 2MB.');
				return;
			}
			if (!file.type.match(/image\/*/)) {
				alert('File is not an image.');
				return;
			}
			const reader = new FileReader();
			reader.onload = (e: any) => {
				this.file = e.target.result;
				this.onChange(this.file);
			}
			reader.readAsDataURL(file);
		}
	}

	resetInput(){
		const input = document.getElementById('avatar-input-file') as HTMLInputElement;
		if (input) {
			input.value = '';
		}
	}
}
