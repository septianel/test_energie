"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("./schema"));
const function_1 = __importDefault(require("./function"));
class ViewModel {
    constructor() {
        this.schema = schema_1.default.VIEW;
    }
}
const queries = [];
exports.default = {
    createView() {
        return queries.map(q => {
            if (!q.schema) {
                q.schema = schema_1.default.VIEW;
            }
            const drop = `DROP VIEW IF EXISTS "${q.schema}"."${q.view_name}" CASCADE;`;
            const create = `CREATE VIEW "${q.schema}"."${q.view_name}" AS ${q.query}`;
            if (q.delete) {
                return function_1.default.formatSpace(drop);
            }
            else {
                return function_1.default.formatSpace(drop + create);
            }
        });
    },
};
