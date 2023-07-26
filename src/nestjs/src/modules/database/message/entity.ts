import {
	Entity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	OneToMany,
} from "typeorm";

@Entity()
export class MessageEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "integer"})
	public roomId: number;

	@Column({ type: "integer"})
	public userId: number;

	@Column({ type: "varchar", length: 120, default: "" })
	public content: string;
	
	@CreateDateColumn({ type: "timestamp" })
	public updateAt: Date;
}
