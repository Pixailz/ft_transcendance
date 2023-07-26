import { IsBooleanString, IsNotEmpty } from "class-validator";

export class UserChatRoomPost {
        @IsBooleanString()
         isOwner?: boolean;
        // @IsBoolean()
         isAdmin?: boolean;
}