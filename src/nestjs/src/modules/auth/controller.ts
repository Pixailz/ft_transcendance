import { Controller, Get, Request, Query, ForbiddenException } from "@nestjs/common";
import { AuthService } from "./service";
import { Public } from "src/public.decorator";
import { DBUser } from "../database/user/dto";
import { ApiBody, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse, getSchemaPath } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	/*
	 * Uses the code given by the 42 API to get the user's token and 
	 * then the user's login. If the user is not in the database, it
	 * creates it. Then it returns a JWT token.
	 * On error, it returns a 500 error.
	 */
	@Public()
	@ApiOkResponse( {
		description: "User successfully logged in",
		schema: {
		example:
		{
			access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiO...",
			status: "register"
		}
	}})
	@ApiInternalServerErrorResponse({
		description: "Invalid code or environment configuration",
		schema: {
		example:
		{
			message: "Internal server error",
			statusCode: 500,
		}	
	}})
	@Get("ft_callback")
	async login(@Query("code") code: string): Promise<any> {
		if (!Number(process.env.PRODUCTION) && code === "test")
			return this.authService.ftSignInTest();
		else return this.authService.ftSignIn(code);
	}

	/*
	 * Returns the user's profile. It is used to check if the user is
	 * logged in.
	 * On error, it returns a 401 error.
	 */
	@ApiUnauthorizedResponse({
		description: "Unauthorized",
		schema: {
		example:
		{
			message: "Unauthorized",
			statusCode: 401,
		}
	}})
	@Get("profile")
	getProfile(@Request() req): DBUser {
		return req.user;
	}
}
