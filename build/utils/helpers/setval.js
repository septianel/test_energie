"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _Records = __importStar(require("app/records"));
const function_1 = __importDefault(require("./function"));
const Records = Object.values(_Records).map(record => record.default);
exports.default = {
    createSETVAL(qR) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Promise.all(Records.map((record) => __awaiter(this, void 0, void 0, function* () {
                const schema = record['table']['schema'];
                const table = record['table']['name'];
                const is_have_id = yield qR.query(function_1.default.formatSpace(`SELECT c.column_name FROM information_schema.columns "c"
						WHERE c.table_schema = '${schema}'
						AND c.table_name = '${table}'`)).then(result => {
                    return result.some(i => i.column_name === 'id');
                });
                if (is_have_id) {
                    return yield qR.query(function_1.default.formatSpace(`SELECT SETVAL('${schema}.${table}_id_seq', (SELECT COALESCE(MAX(id), 1) FROM "${schema}"."${table}"), CASE WHEN (SELECT MAX(id) FROM "${schema}"."${table}") ISNULL THEN FALSE ELSE TRUE END)`));
                }
                return;
            })));
        });
    },
};
