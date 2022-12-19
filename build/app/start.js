"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
require("reflect-metadata");
(0, dotenv_1.config)();
const default_1 = __importDefault(require("../utils/constants/default"));
default_1.default.setDebugLevel(process.env.DEBUG === 'true');
const database_1 = __importDefault(require("./database"));
database_1.default
    .init(process.argv.filter((i, n) => n > 1))
    .catch(console.warn);
