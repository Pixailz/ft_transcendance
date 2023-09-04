import { Body, Controller, Post } from "@nestjs/common";
const fs = require("fs");

@Controller("errorlog")
export class ErrorLogController {
	//write log to logfile error.log and print to console
	@Post()
	async save(@Body() error: any): Promise<any> {
		const date = new Date();
		const log = `${date.toISOString()} ${error.message}\n${
			error.stack
		}\n\n`;

		if (!fs.existsSync("logs")) {
			fs.mkdirSync("logs");
		}

		fs.appendFile("logs/angular.err", log, (err) => {
			if (err) console.error(err);
		});

		console.error(
			`[${error.url}] error received: ${error.message}. See logs/angular.err for more details.`,
		);

		return { status: "ok" };
	}
}
