import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
export declare class UserController {
    private readonly service;
    getUser(id: number): Promise<User>;
    createUser(body: CreateUserDto): Promise<User>;
}
