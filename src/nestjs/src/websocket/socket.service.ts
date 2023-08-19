import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class WSSocket {
	socket_list: any = {};

	addNewSocketId(user_id: number, socket_id: string) {
		if (this.socket_list[user_id] !== undefined)
			this.socket_list[user_id].push(socket_id);
		else this.socket_list[user_id] = [socket_id];
	}

	getSocketId(user_id: number): string[] | undefined {
		for (const user_id_str in this.socket_list)
			if (user_id == Number(user_id_str))
				return this.socket_list[user_id_str];
		return undefined;
	}

	getUserId(socket_id: string): number | undefined {
		for (const user_id in this.socket_list) {
			for (let i = 0; i < this.socket_list[user_id].length; i++)
				if (this.socket_list[user_id][i] === socket_id)
					return Number(user_id);
		}
		return undefined;
	}

	removeSocket(socket_id: string) {
		for (const user_id in this.socket_list)
			for (let i = 0; i < this.socket_list[user_id].length; i++)
				if (this.socket_list[user_id][i] === socket_id)
					this.socket_list[user_id].splice(i, 1);
	}
}
