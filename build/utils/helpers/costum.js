"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = __importDefault(require("./function"));
const queries = [
    {
        costum_name: 'sales_report_transaction',
        query: ``,
    },
];
exports.default = {
    createCostumQuery() {
        return queries.map(q => {
            return function_1.default.formatSpace(q.query);
        });
    },
};
