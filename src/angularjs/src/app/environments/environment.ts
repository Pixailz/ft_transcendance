import { commonEnvironment } from "./environment.common";

const env: Partial<typeof commonEnvironment> = {};

export const environment = Object.assign(commonEnvironment, env);
