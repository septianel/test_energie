"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class NamingHelper extends typeorm_1.DefaultNamingStrategy {
    foreignKeyNaming() {
        return [].map(data => {
            return `COMMENT ON CONSTRAINT "${data.rel}" ON ${data.table} IS E\'${data.comment}\'`;
        });
    }
}
exports.default = new NamingHelper();
