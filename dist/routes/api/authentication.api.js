"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = require("../../services/user.service");
const passport_1 = __importDefault(require("passport"));
class AuthenticationApi {
    constructor() {
        this.router = express_1.Router();
        this.routes();
    }
    // get a single post by params of 'slug'
    one(req, res) {
        const { slug } = req.params;
        res.status(200).json({
            key: "test",
            value: "test"
        });
    }
    async signUp(req, res) {
        const user = req.body;
        const result = await new user_service_1.UserService().createUser(user);
        res.status(result.statusCode).json(result);
    }
    async signIn(req, res) {
        const user = req.body;
        const result = await new user_service_1.UserService().signIn(user.email, user.password);
        res.status(result.statusCode).json(result);
    }
    signOut(req, res) {
        const user = req.user;
        res.status(200).json(user);
    }
    routes() {
        this.router.get('/test', this.one);
        this.router.post('/sign-up', this.signUp);
        this.router.post('/sign-in', this.signIn);
        this.router.post('/sign-out', passport_1.default.authenticate('jwt', {
            session: false
        }), this.signOut);
    }
}
exports.AuthenticationApi = AuthenticationApi;
const authenticationApi = new AuthenticationApi();
authenticationApi.routes();
exports.default = authenticationApi.router;
