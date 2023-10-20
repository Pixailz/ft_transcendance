import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-protected-room-password',
  templateUrl: './protected-room-password.component.html',
  styleUrls: ['./protected-room-password.component.scss']
})
export class ProtectedRoomPasswordComponent {
	passwordForm!: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<ProtectedRoomPasswordComponent>,
		private formBuilder: FormBuilder,
	) {}

	ngOnInit() {
		this.passwordForm = this.formBuilder.group({
			password: ""
		});
	}

	ngOnDestroy() {
		this.dialogRef.close(this.passwordForm.value.password);
	}
}
