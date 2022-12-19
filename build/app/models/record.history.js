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
const plain_record_1 = __importDefault(require("./plain.record"));
const typeorm_1 = require("typeorm");
class RecordHistoryModel extends plain_record_1.default {
    aggregate(config) {
        this.id = config.id;
        this.created_at = config.created_at;
        this.changer_user_id = config.changer_user_id;
        return this;
    }
    setId(id) {
        this.id = id;
        return this;
    }
    setCreatedAt(created_at) {
        this.created_at = created_at;
        return this;
    }
    setChangerUserId(changer_user_id) {
        this.changer_user_id = changer_user_id;
        return this;
    }
}
RecordHistoryModel.columns = [
    'id',
    'created_at',
    'changer_user_id',
];
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RecordHistoryModel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        type: 'timestamp with time zone',
    }),
    __metadata("design:type", Date)
], RecordHistoryModel.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", Number)
], RecordHistoryModel.prototype, "changer_user_id", void 0);
exports.default = RecordHistoryModel;
