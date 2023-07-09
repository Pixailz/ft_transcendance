import {
	Entity,
	OneToOne,
	Column,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	JoinColumn,
} from "typeorm";

import { UserEntity } from "../user/entity";

@Entity()
export class UserInfoEntity {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: "varchar", length: 120, default: "" })
	public picture: string;

	@Column({ type: "varchar", length: 120, default: "" })
	public nickname: string;
	
	@Column({ type: "varchar", length: 120, default: "" })
	public name: string;

	@Column({ type: "varchar", length: 120, default: "" })
	public email: string;

	@UpdateDateColumn({ type: "timestamp" })
	public updatedAt!: Date;

	@OneToOne(type => UserEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' }) 
	user_id: UserEntity;
}

