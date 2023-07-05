import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column({ type: 'varchar', length: 120 })
	public name: string;

	@Column({ type: 'varchar', length: 120 })
	public email: string;

	@Column({ type: 'int' })
	public ft_id: number;

	@Column({ type: 'varchar', length: 120 })
	public ft_login: string;

	@Column({ type: 'boolean', default: false })
	public isDeleted: boolean;

	@Column({ type: 'varchar', length: 120 })
	public picture: string;
	
	@Column({ type: 'varchar', length: 120 })
	public nickname: string;

	@Column({ type: 'varchar', length: 120 })
	public picture: string;

	/*
	* Create and Update Date Columns
	*/

	@CreateDateColumn({ type: 'timestamp' })
	public createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	public updatedAt!: Date;
}
