"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT;
validatePort();
app_1.default.listen(PORT, () => {
    console.info('##########################################################');
    console.info('#####               STARTING SERVER                  #####');
    console.info('##########################################################\n');
    console.info(`Server is now running on http://localhost:${PORT}`);
});
function validatePort() {
    if (!PORT) {
        throw Error('Port is missing');
    }
}
