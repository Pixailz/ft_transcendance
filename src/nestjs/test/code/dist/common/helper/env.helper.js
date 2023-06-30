"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvPath = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
function getEnvPath(dest) {
    const env = process.env.NODE_ENV;
    const fallback = (0, path_1.resolve)(`${dest}/.env`);
    const filename = env ? `${env}.env` : 'development.env';
    let filePath = (0, path_1.resolve)(`${dest}/${filename}`);
    if (!(0, fs_1.existsSync)(filePath)) {
        filePath = fallback;
    }
    return filePath;
}
exports.getEnvPath = getEnvPath;
//# sourceMappingURL=env.helper.js.map