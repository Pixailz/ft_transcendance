import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserI } from 'src/app/interfaces/user/user.interface';

@Component({
	selector: 'app-chat-channel-friend-list',
	templateUrl: './chat-channel-friend-list.component.html',
	styleUrls: ['./chat-channel-friend-list.component.scss']
})
export class ChatChannelFriendListComponent {
	friends: UserI[] = this.data.friends;
	showed_friends: UserI[] = this.data.friends;
	friend_added: number[] = this.data.friend_added;
	searchFriendForm!: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private formBuilder: FormBuilder,
		public dialogRef: MatDialogRef<ChatChannelFriendListComponent>
	) {}

	ngOnInit() {
		this.searchFriendForm = this.formBuilder.group({
			searchString: ""
		});
		this.searchFriendForm.valueChanges.subscribe((value) => {
			this.showed_friends = this.filterAndSortUsers(value.searchString);
		})
	}

	ngOnDestroy() {
		this.dialogRef.close(this.friend_added);
	}

	filterAndSortUsers(searchString: string): UserI[] {
		const filteredUsers = this.friends.filter(user =>
			user.ftLogin.toLowerCase().includes(searchString) || user.nickname.toLowerCase().includes(searchString)
		);

		const sortedUsers = this.sortUsersByMatching(filteredUsers, searchString.toLowerCase());

		return sortedUsers;
	}

	private sortUsersByMatching(users: UserI[], searchString: string): UserI[] {
		return users.sort((a, b) =>
			this.calculateMatchingScore(b, searchString) - this.calculateMatchingScore(a, searchString)
		);
	}

	private calculateMatchingScore(user: UserI, searchString: string): number {
		const ftLoginScore = this.calculateSimilarityScore(user.ftLogin.toLowerCase(), searchString);
		const nicknameScore = this.calculateSimilarityScore(user.nickname.toLowerCase(), searchString);
		return (ftLoginScore + nicknameScore) / 2;
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
		return 1 / (1 + dp[m][n]);
	}

	public toggleFriend(friend: UserI) {
		const elem_index = this.friend_added.findIndex((elem) => 
			elem === friend.id
		);
		if (elem_index === -1) {
			this.friend_added.push(friend.id);
		} else {
			this.friend_added.splice(elem_index, 1);
		}
	}

	public isFriendAdded(friend: UserI) {
		return this.friend_added.findIndex((elem) => elem === friend.id) !== -1;
	}
}
