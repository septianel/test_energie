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
const function_1 = __importDefault(require("./function"));
const _Records = __importStar(require("app/records"));
const Records = Object.values(_Records).map(record => {
    try {
        const instanceRecord = new record.default();
        const schema = record.default['table']['schema'];
        const table = record.default['table']['name'];
        return {
            schema,
            table,
            trigger: instanceRecord['trigger'](),
        };
    }
    catch (e) {
        return null;
    }
}).filter(i => !!i);
const queries = [
    {
        name: 'set_destionation_sicepat_location',
        triggerOnTable: ['master.location'],
        method: ['UPDATE'],
        delete: true,
        time: 'BEFORE',
        query: `
		NEW.destination_id = (SELECT
		s.id
		FROM AREA.sicepat s
		WHERE
		(s.subdistrict ILIKE ('%' || NULLIF(OLD.suburb_name, '') || '%')  OR s.subdistrict ILIKE ('%' || NULLIF(OLD.suburb_alias, '') || '%'))
		AND s.city ILIKE ('%' || NULLIF(OLD.city_name, '') || '%')
		LIMIT 1);`
    },
    {
        name: 'delete_cart_item',
        triggerOnTable: ['app.cart_item'],
        method: ['UPDATE'],
        delete: true,
        time: 'AFTER',
        query: `
		IF (NEW.deleted_at IS NOT NULL) THEN
		UPDATE app.cart_item
		SET
		deleted_at = NEW.deleted_at
		WHERE cart_id = NEW.cart_id AND type = NEW.type AND ref_id = NEW.ref_id AND deleted_at IS NULL;
		END IF;`,
    },
    {
        name: 'order_cart_item',
        triggerOnTable: ['app.cart_item'],
        method: ['UPDATE'],
        delete: true,
        time: 'AFTER',
        query: `
		IF (NEW.ordered_at IS NOT NULL) THEN
		UPDATE app.cart_item
		SET
		deleted_at = NEW.ordered_at
		WHERE cart_id = NEW.cart_id AND type = NEW.type AND ref_id = NEW.ref_id AND ordered_at IS NULL AND deleted_at IS NULL;
		END IF;`,
    },
    {
        name: 'add_cart_item',
        triggerOnTable: ['app.cart_item'],
        method: ['INSERT'],
        delete: true,
        time: 'AFTER',
        query: `
		UPDATE app.cart_item
		SET
		quantity = COALESCE((SELECT ci.quantity FROM app.cart_item ci WHERE cart_id = NEW.cart_id AND type = NEW.type AND ref_id = NEW.ref_id AND ordered_at IS NULL AND deleted_at IS NULL ORDER BY ci.id DESC OFFSET 1 LIMIT 1), 0) + NEW.quantity
		WHERE cart_id = NEW.cart_id AND type = NEW.type AND ref_id = NEW.ref_id AND ordered_at IS NULL AND deleted_at IS NULL;
		`,
    },
    {
        name: 'update_cart_item',
        triggerOnTable: ['app.cart_item'],
        method: ['UPDATE'],
        delete: true,
        time: 'AFTER',
        query: `
		UPDATE app.cart_item
		SET
		quantity = NEW.quantity
		WHERE cart_id = NEW.cart_id AND type = NEW.type AND ref_id = NEW.ref_id AND ordered_at IS NULL AND deleted_at IS NULL;
		`,
    },
    {
        name: 'order_cart_item_by_order',
        triggerOnTable: ['app.order_detail'],
        method: ['INSERT'],
        delete: true,
        time: 'AFTER',
        query: `
		UPDATE app.cart_item
		SET
		ordered_at = NOW()
		WHERE cart_id = (SELECT "cart".id from app.cart "cart" WHERE "cart".user_id = (SELECT "order".user_id from app.order "order" where "order".id = NEW.order_id limit 1) limit 1) AND type::TEXT = NEW.type::TEXT AND ref_id = NEW.ref_id AND ordered_at IS NULL AND deleted_at IS NULL;`
    },
    {
        name: 'set_variant_status',
        triggerOnTable: ['app.variant'],
        method: ['INSERT', 'UPDATE'],
        delete: true,
        time: 'BEFORE',
        query: () => __awaiter(void 0, void 0, void 0, function* () {
            return `
			NEW.option_1 = LOWER(TRIM(NEW.option_1));
			NEW.option_2 = LOWER(TRIM(NEW.option_2));
			NEW.updated_at = NOW();

			IF(COUNT((select type.id from app.variant_type type where type.product_id = NEW.product_id limit 1)) < 1) THEN
			RAISE EXCEPTION 'cannot set variant without variant_type';
			END IF;

			IF(NEW.option_2 IS NOT NULL AND NEW.option_1 = '') THEN
			RAISE EXCEPTION 'cannot set option_2 when option_1 IS EMPTY';
			END IF;

			IF(NEW.deleted_at IS NOT NULL) THEN
			NEW.status = 'UNAVAILABLE';
			END IF;

			IF ((select type.type_1 from app.variant_type type where type.product_id = NEW.product_id limit 1) IS NULL) THEN

			IF(NEW.option_1 = '') THEN
			NEW.status = 'AVAILABLE';
			NEW.deleted_at = NULL;
			ELSE
			NEW.status = 'UNAVAILABLE';
			NEW.deleted_at = NOW();
			END IF;

			ELSE

			IF(NEW.option_1 = '') THEN
			NEW.status = 'UNAVAILABLE';
			NEW.deleted_at = NOW();
			END IF;

			END IF;`;
        })
    },
    {
        name: 'set_variant_type',
        triggerOnTable: ['app.variant_type'],
        method: ['INSERT', 'UPDATE'],
        delete: true,
        time: 'AFTER',
        query: () => __awaiter(void 0, void 0, void 0, function* () {
            return `
			NEW.type_1 = TRIM(LOWER(NEW.type_1));
			NEW.type_2 = TRIM(LOWER(NEW.type_2));
			IF(NEW.type_2 IS NOT NULL AND NEW.type_1 IS NULL) THEN
			RAISE EXCEPTION 'cannot set type_2 when type_1 IS NULL';
			END IF;

			IF(NEW.type_1 IS NULL) THEN

			UPDATE app.variant
			SET
			deleted_at = NULL,
			status = 'AVAILABLE'
			WHERE product_id = NEW.product_id AND option_1 = '';
			UPDATE app.variant
			SET
			status = 'UNAVAILABLE',
			deleted_at = NOW()
			WHERE product_id = NEW.product_id AND option_1 <> '';

			ELSE

			UPDATE app.variant
			SET
			deleted_at = NOW(),
			status = 'UNAVAILABLE'
			WHERE product_id = NEW.product_id AND option_1 = '';

			END IF;
			`;
        })
    },
];
function createFunctionTrigger({ schema, table, trigger }, qR) {
    return __awaiter(this, void 0, void 0, function* () {
        const func_name = `"function".func_trigger_${trigger.name}_${schema}_${table}()`;
        const drop = `DROP FUNCTION IF EXISTS ${func_name} CASCADE;`;
        const variable = trigger.variable ? `DECLARE ` + trigger.variable : '';
        const create = `CREATE FUNCTION ${func_name} RETURNS TRIGGER
			AS $$
			${variable}
			BEGIN
			${typeof trigger.query === 'string' ? trigger.query : yield trigger.query(qR)}
			RETURN NEW;
			END
			$$
			LANGUAGE PLPGSQL;`;
        if (trigger.delete) {
            return function_1.default.formatSpace(drop);
        }
        else {
            return function_1.default.formatSpace(drop + create);
        }
    });
}
function createTrigger({ schema, table, trigger }) {
    const name = `trigger_${trigger.name}`;
    const func_name = `"function".func_trigger_${trigger.name}_${schema}_${table}()`;
    const drop = `DROP TRIGGER IF EXISTS ${name} ON "${schema}"."${table}" CASCADE;`;
    const create = `CREATE TRIGGER ${name}
				${trigger.time} ${trigger.method.join(' OR ')} ON "${schema}"."${table}"
				FOR EACH ROW
				WHEN (pg_trigger_depth() = 0)
				EXECUTE PROCEDURE ${func_name};`;
    if (trigger.delete) {
        return function_1.default.formatSpace(drop);
    }
    else {
        return function_1.default.formatSpace(drop + create);
    }
}
queries.forEach(i => i);
exports.default = {
    createTRIGGER(qR) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Promise.all(Object.values(Records).map((Record) => __awaiter(this, void 0, void 0, function* () {
                const schema = Record.schema;
                const table = Record.table;
                const triggers = yield Record.trigger;
                return yield Promise.all(triggers.map((trigger) => __awaiter(this, void 0, void 0, function* () {
                    return [
                        yield createFunctionTrigger({ schema, table, trigger }, qR),
                        createTrigger({ schema, table, trigger }),
                    ];
                })));
            })));
        });
    },
};
