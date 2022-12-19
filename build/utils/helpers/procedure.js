"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = __importDefault(require("./function"));
const queries = [];
exports.default = {
    createProcedure() {
        return queries.map(q => function_1.default.formatSpace(q.delete ? q.drop : (q.drop + q.query)));
    },
};
