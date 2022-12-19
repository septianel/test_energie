"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordModel = exports.RecordImmutableModel = exports.RecordHistoryModel = exports.RecordAddressModel = exports.PlainRecordModel = void 0;
const plain_record_1 = __importDefault(require("./plain.record"));
exports.PlainRecordModel = plain_record_1.default;
const record_address_1 = __importDefault(require("./record.address"));
exports.RecordAddressModel = record_address_1.default;
const record_history_1 = __importDefault(require("./record.history"));
exports.RecordHistoryModel = record_history_1.default;
const record_immutable_1 = __importDefault(require("./record.immutable"));
exports.RecordImmutableModel = record_immutable_1.default;
const record_1 = __importDefault(require("./record"));
exports.RecordModel = record_1.default;
