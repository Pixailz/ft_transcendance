import {
	Entity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn()
	public id: number;
	
	@Column({ type: "varchar", length: 120, default: "" })
	public ft_login: string;	

	@Column({ type: "boolean", default: false })
	public isDeleted: boolean;

	@CreateDateColumn({ type: "timestamp" })
	public createdAt!: Date;
}
