import { IsInt, IsNotEmpty } from "class-validator";

export class UserPost {
	@IsNotEmpty()
	ft_login?: string;

	@IsInt()
	ft_id?: number;
}
