"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const jwtStrategy_1 = __importDefault(require("./lib/jwtStrategy"));
require('dotenv').config();
const authentication_api_1 = require("./routes/api/authentication.api");
const authApi = new authentication_api_1.AuthenticationApi();
class App {
    constructor() {
        this.app = express_1.default();
        this.config()
            .routes();
    }
    // application config
    config() {
        const mongoDbURI = process.env.MONGODB_URI || '';
        mongoose_1.default.Promise = global.Promise;
        this.validateMongoDbUri(mongoDbURI);
        mongoose_1.default.connect(mongoDbURI, {
            useNewUrlParser: true
        });
        this.app.use(jwtStrategy_1.default.init());
        // express middleware
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        return this;
    }
    validateMongoDbUri(mongoDbURI) {
        if (!mongoDbURI) {
            throw Error('MongoConnection is missing');
        }
    }
    // application routes
    routes() {
        const router = express_1.default.Router();
        this.app.use('/', router);
        this.app.use('/api/auth', authApi.router);
        return this;
    }
}
// export
exports.default = new App().app;
