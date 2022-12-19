"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const record_1 = __importDefault(require("./record"));
const typeorm_1 = require("typeorm");
class RecordAddressModel extends record_1.default {
}
RecordAddressModel.columns = [
    ...record_1.default.columns,
    'title',
    'receiver',
    'phone',
    'address',
    'district',
    'postal',
    'coords',
    'metadata',
    'location_id',
];
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
    }),
    __metadata("design:type", Number)
], RecordAddressModel.prototype, "location_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 126,
        nullable: false,
    }),
    __metadata("design:type", String)
], RecordAddressModel.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 126,
        nullable: true,
    }),
    __metadata("design:type", String)
], RecordAddressModel.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 31,
        nullable: true,
    }),
    __metadata("design:type", String)
], RecordAddressModel.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        type: 'text',
    }),
    __metadata("design:type", String)
], RecordAddressModel.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 126,
        nullable: true,
    }),
    __metadata("design:type", String)
], RecordAddressModel.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 15,
        nullable: false,
    }),
    __metadata("design:type", String)
], RecordAddressModel.prototype, "postal", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'point',
        nullable: true,
    }),
    __metadata("design:type", Object)
], RecordAddressModel.prototype, "coords", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: {},
        nullable: true,
        type: 'jsonb',
    }),
    __metadata("design:type", Object)
], RecordAddressModel.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: 'timestamp with time zone',
    }),
    __metadata("design:type", Date)
], RecordAddressModel.prototype, "deleted_at", void 0);
exports.default = RecordAddressModel;
