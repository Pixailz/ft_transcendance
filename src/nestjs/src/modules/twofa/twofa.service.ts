import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { authenticator } from "otplib";
import { UserEntity } from "../database/user/entity";
import { toDataURL } from "qrcode";
import { DBUserService } from "../database/user/service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TwofaService {
	constructor(
		private dbUserService: DBUserService,
		private jwtService: JwtService,
	) {}

	private async generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	private async generateTwoFactorAuthenticationSecret(user: UserEntity) {
		const secret = authenticator.generateSecret();

		const otpauthUrl = authenticator.keyuri(
			user.email,
			"transcendence",
			secret,
		);

		return {
			secret: secret,
			otpauthUrl: otpauthUrl,
		};
	}

	async verifyCode(nonce: string, code: string): Promise<any> {
		const user = await this.dbUserService.returnOneByNonce(nonce);
		if (!user) throw new ForbiddenException("User not found");

		if (!user.twoAuthFactor || user.twoAuthFactorSecret == "") {
			throw new ForbiddenException("User not setup");
		}

		const isCodeValid = authenticator.verify({
			token: code,
			secret: user.twoAuthFactorSecret,
		});

		if (!isCodeValid) throw new ForbiddenException("Invalid code");

		const payload = { sub: user.id };
		return {
			access_token: await this.jwtService.signAsync(payload),
			status: "oke",
		};
	}

	async setup(nonce: string): Promise<any> {
		const user = await this.dbUserService.returnOneByNonce(nonce);
		if (!user) throw new ForbiddenException("User not found");

		if (user.twoAuthFactor)
			throw new ForbiddenException("User already setup");

		const { secret, otpauthUrl } =
			await this.generateTwoFactorAuthenticationSecret(user);

		const qrCodeDataURL = await this.generateQrCodeDataURL(otpauthUrl);

		await this.dbUserService
			.update(user.id, {
				twoAuthFactorSecret: secret,
			})
			.catch(() => {
				throw new ForbiddenException("User can not be setup");
			});

		return {
			qrCodeDataURL: qrCodeDataURL,
		};
	}

	async verifySetup(nonce: string, code: string): Promise<any> {
		const user = await this.dbUserService.returnOneByNonce(nonce);
		if (!user) throw new ForbiddenException("User not found");

		if (user.twoAuthFactor)
			throw new ForbiddenException("User already setup");

		const isCodeValid = authenticator.verify({
			token: code,
			secret: user.twoAuthFactorSecret,
		});

		if (!isCodeValid) throw new ForbiddenException("Invalid code");

		await this.dbUserService
			.update(user.id, {
				twoAuthFactor: true,
			})
			.catch(() => {
				throw new ForbiddenException("User can not be setup");
			});

		const payload = { sub: user.id };
		return {
			access_token: await this.jwtService.signAsync(payload),
			status: "oke",
		};
	}

	async disable(id: number): Promise<any> {
		const user = await this.dbUserService.returnOne(id);
		if (!user) throw new NotFoundException("User not found");

		return await this.dbUserService.update(id, {
			twoAuthFactor: false,
			twoAuthFactorSecret: "",
		});
	}
}
