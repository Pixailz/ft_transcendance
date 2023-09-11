import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import * as http from "http";

import { Server, Room, LobbyRoom } from "colyseus";

type Type<T> = new (...args: any[]) => T;

@Injectable()
export class ColyseusService implements OnApplicationShutdown {
	rooms: Type<Room<any, any>>[] = [LobbyRoom];
	server: Server = null;

	createServer(httpServer: http.Server) {
		if (this.server) return;

		this.server = new Server({ server: httpServer });
	}

	defineRoom(name: string, room: Type<Room<any, any>>) {
		this.server.define(name, room);
	}

	listen(port: number): Promise<unknown> {
		if (!this.server) return;
		return this.server.listen(port);
	}

	onApplicationShutdown(sig) {
		if (!this.server) return;
		console.info(
			`Caught signal ${sig}. Game service shutting down on ${new Date()}.`,
		);
		this.server.gracefullyShutdown();
	}
}
