import { MessageEntity } from "../message/entity";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";

export enum MessageContentType {
	STRING,
	GAME_INVITE,
	// TODO
	IMAGE,
}

@Entity()
export class MessageContentEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({type: "integer", default: -1})
	public messageId: number;

	@Column({ type: "integer", default: MessageContentType.STRING})
	public type: MessageContentType;

	@ManyToOne((type) => MessageEntity, (message) => message.content, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "messageId" })
	public message: MessageEntity;

	@Column({ type: "varchar", default: "" })
	public content: string;
}
