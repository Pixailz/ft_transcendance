import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { pairwise } from 'rxjs';
import { WSGateway } from 'src/app/services/websocket/gateway';

@Component({
  selector: 'app-new-chat-room',
  templateUrl: './new-chat-room.component.html',
  styleUrls: ['./new-chat-room.component.scss']
})
export class NewChatRoomComponent {

  newRoomForm!: FormGroup;
  userList:    number[] = [];
  // passDisabled: boolean = false;

  constructor (
    private formBuilder: FormBuilder,
    private wsGateway: WSGateway,
    private dialogRef: MatDialogRef<NewChatRoomComponent>,
    ){}

    ngOnInit() {
      this.newRoomForm = this.formBuilder.group({
        name: "",
        password: "",
        isPrivate: false,
      });
      
      this.newRoomForm.valueChanges
      
      .pipe(pairwise())
      .subscribe(([prev, next]: [any, any]) => {
            if (prev.isPrivate != next.isPrivate)
            {
              if (next.isPrivate)
              {
                this.newRoomForm.get("password").setValue("");
                this.newRoomForm.get("password").disable({onlySelf: true});
              }
              else
                this.newRoomForm.get("password").enable({onlySelf: true});
            }
      });
    }

    onCreate()
    {
      if (!this.newRoomForm.valid)
        return ;
      this.wsGateway.createChannelRoom(
        this.newRoomForm.value.name,
        this.newRoomForm.value.password,
        this.newRoomForm.value.isPrivate,
        this.userList
      );
      this.dialogRef.close();
    }
}
