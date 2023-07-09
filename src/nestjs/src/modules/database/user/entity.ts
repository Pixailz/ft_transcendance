import {
	Entity,
	Column,
	OneToOne,
	JoinColumn,
	CreateDateColumn,
	PrimaryGeneratedColumn,
} from "typeorm";

import { UserInfoEntity } from "../userInfo/entity";

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn()
	public id: number;
	
	@Column({ type: "int", default: 0 })
	public ft_id: number;

	@Column({ type: "varchar", length: 120, default: "" })
	public ft_login: string;	

	@Column({ type: "boolean", default: false })
	public isDeleted: boolean;

	@CreateDateColumn({ type: "timestamp" })
	public createdAt!: Date;

	@OneToOne(() => UserInfoEntity, (info_id) => info_id.user_id)
	info_id: UserInfoEntity;
}
