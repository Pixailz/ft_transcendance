import { IsNotEmpty, IsOptional } from "class-validator";

export class ChatRoomPost {
        @IsNotEmpty()
        name?: string;

        @IsOptional()
        type?: string;

        @IsOptional()
        password?: string;
}