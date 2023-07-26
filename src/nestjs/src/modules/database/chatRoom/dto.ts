import { IsNotEmpty } from "class-validator";

export class ChatRoomPost {
        @IsNotEmpty()
        name?: string;
        // @IsNotEmpty()
        type?: string;
        // @IsNotEmpty()
        password?: string;
}