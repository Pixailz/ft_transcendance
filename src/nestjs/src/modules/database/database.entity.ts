import {
	Entity,
	Unique,
	OneToOne,
	JoinColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn()
	public ft_id: number;

	@Column({ type: "varchar", length: 120, default: "" })
	public ft_login: string;

	@Column({ type: "boolean", default: false })
	public isDeleted: boolean;

	@CreateDateColumn({ type: "timestamp" })
	public createdAt!: Date;
}

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

	@OneToOne(() => UserEntity, (user: UserEntity) => user.ft_id)
	public user_info: UserEntity;
}
