import { commonEnvironment } from "./environment.common";

const env: Partial<typeof commonEnvironment> = {
	socket_url: "http://10.12.250.90:3001",
	after_auth_uri: "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d051dd7a35b0f79ee848231784c70f568b325bfe7cda78468e9e1b142bd511e2&redirect_uri=http%3A%2F%2F10.12.250.90%3A4200%2Flogin&response_type=code",
};

export const environment = Object.assign(commonEnvironment, env);
