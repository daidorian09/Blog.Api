"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ROUND = 10;
class PasswordService {
    async hashPassword(password) {
        return await bcryptjs_1.default.hash(password, ROUND);
    }
    async generateSalt() {
        return await bcryptjs_1.default.genSalt(ROUND);
    }
    async validatePassword(password, hashedPassword) {
        return await bcryptjs_1.default.compare(password, hashedPassword);
    }
}
exports.PasswordService = PasswordService;
