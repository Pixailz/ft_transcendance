import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatRoomI, RoomType } from 'src/app/interfaces/chat/chat-room.interface';
import { ChatChannelService } from 'src/app/services/websocket/chat/channel/service';
import { ChatRoomService } from 'src/app/services/websocket/chat/chatroom.service';
import { WSGateway } from 'src/app/services/websocket/gateway';
import { ProtectedRoomPasswordComponent } from '../protected-room-password/protected-room-password.component';

@Component({
  selector: 'app-join-chat-room',
  templateUrl: './join-chat-room.component.html',
  styleUrls: ['./join-chat-room.component.scss']
})
export class JoinChatRoomComponent {
	showed_rooms: ChatRoomI[] = this.chatChannelService.getAvailableChannelRoom();
	searchRoomForm!: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<JoinChatRoomComponent>,
		private chatChannelService: ChatChannelService,
		public chatRoomService: ChatRoomService,
		private dialog: MatDialog,
		private wsGateway: WSGateway,
	) {}

	ngOnInit() {
		this.searchRoomForm = this.formBuilder.group({
			searchString: ""
		});
		this.searchRoomForm.valueChanges.subscribe((value) => {
			this.showed_rooms = this.filterAndSortRooms(value.searchString);
		})
	}

	filterAndSortRooms(searchString: string): ChatRoomI[] {
		const filteredRooms = this.chatChannelService.getAvailableChannelRoom().filter(room =>
			room.name.toLowerCase().includes(searchString)
		);

		const sortedRooms = this.sortRoomsByMatching(filteredRooms, searchString.toLowerCase());

		return (sortedRooms);
	}

	private sortRoomsByMatching(rooms: ChatRoomI[], searchString: string): ChatRoomI[] {
		return rooms.sort((a, b) =>
			this.calculateSimilarityScore(b.name.toLowerCase(), searchString) - this.calculateSimilarityScore(a.name.toLowerCase(), searchString)
		);
	}

	private calculateSimilarityScore(str1: string, str2: string): number {
		const m = str1.length;
		const n = str2.length;
		const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

		for (let i = 0; i <= m; i++) {
			for (let j = 0; j <= n; j++) {
				if (i === 0) {
					dp[i][j] = j;
				} else if (j === 0) {
					dp[i][j] = i;
				} else if (str1[i - 1] === str2[j - 1]) {
					dp[i][j] = dp[i - 1][j - 1];
				} else {
					dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
				}
			}
		}
		return (1 / (1 + dp[m][n]));
	}

	public joinRoom(room: ChatRoomI) {
		console.log(room);
		if (room.type === RoomType.PROTECTED) {
			let dialog = this.dialog.open(ProtectedRoomPasswordComponent, {
				panelClass: ['custom-dialog'],
				data: {},
			});
			dialog.afterClosed().subscribe((password: string) => {
				console.log(room.id, password)
				this.wsGateway.joinChannelRoom(room.id, password);
			})
		}
		else {
			this.wsGateway.joinChannelRoom(room.id, "");
		}
	}
}
