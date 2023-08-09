import { Injectable } from "@nestjs/common";
import { UserEntity } from "../database/user/entity";

export interface SocketI {
	socket_id: string;
	user: UserEntity;
}

@Injectable()
export class WSService {
	socket_list: SocketI[] = [];

	getSocketId(user: UserEntity | number): string | undefined {
		for (let i = 0; i < this.socket_list.length; i++) {
			if (typeof user === "number") {
				if (this.socket_list[i].user.id == user)
					return this.socket_list[i].socket_id;
			} else {
				if (this.socket_list[i].user == user)
					return this.socket_list[i].socket_id;
			}
		}
		return undefined;
	}

	getUser(socket_id: string): UserEntity | undefined {
		for (let i = 0; i < this.socket_list.length; i++) {
			if (this.socket_list[i].socket_id == socket_id)
				return this.socket_list[i].user;
		}
		return undefined;
	}

	removeSocket(socket_id: string) {
		for (let i = 0; i < this.socket_list.length; i++) {
			if (this.socket_list[i].socket_id == socket_id)
				this.socket_list.splice(i, 1);
		}
	}
}
