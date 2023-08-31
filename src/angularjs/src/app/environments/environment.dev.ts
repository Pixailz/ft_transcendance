import { commonEnvironment } from "./environment.common";

const env: Partial<typeof commonEnvironment> = {
	socket_url: "https://jubilant-space-spork-4vxx7jx44xqhjgjg-3001.app.github.dev",
	after_auth_uri: "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-1d5b23889b0ab60138b9cb5207201631a9ff43db8814ad651cc2917807d92c35&redirect_uri=https%3A%2F%2Fjubilant-space-spork-4vxx7jx44xqhjgjg-4200.app.github.dev%2Flogin&response_type=code",
};

export const environment = Object.assign(commonEnvironment, env);
