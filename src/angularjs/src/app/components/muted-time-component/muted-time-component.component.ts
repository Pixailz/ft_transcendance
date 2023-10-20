import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-muted-time-component',
  templateUrl: './muted-time-component.component.html',
  styleUrls: ['./muted-time-component.component.scss']
})
export class MutedTimeComponentComponent {
	mutedTimeForm!: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<MutedTimeComponentComponent>,
		private formBuilder: FormBuilder,
	) {}

	ngOnInit() {
		this.mutedTimeForm = this.formBuilder.group({
			muted_time: 0
		});
	}

	ngOnDestroy() {
		this.dialogRef.close(this.mutedTimeForm.value.muted_time);
	}
}
