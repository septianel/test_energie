"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listener_event_name = void 0;
const schema_1 = __importDefault(require("./schema"));
const function_1 = __importDefault(require("./function"));
exports.listener_event_name = 'event_global_listener';
const queries = [];
exports.default = {
    createFunctionListener() {
        try {
            return queries.map(q => {
                if (!q.schema) {
                    q.schema = schema_1.default.FUNCTION;
                }
                if (q.triggerOnTable && q.triggerOnTable.length > 0) {
                    const payload = `
					'table', TG_TABLE_NAME::text,
					'schema', TG_TABLE_SCHEMA::text,
					'type', TG_OP::text,
					'name', '${q.name}'`;
                    const drop = `DROP FUNCTION IF EXISTS "${q.schema}".func_listener_${q.name}() CASCADE;`;
                    const create = `CREATE FUNCTION "${q.schema}".func_listener_${q.name}() RETURNS TRIGGER
					AS $$
					BEGIN
					IF TG_OP = 'INSERT' THEN
					PERFORM pg_notify(
					'${exports.listener_event_name}',
					json_build_object(
						'new', row_to_json(NEW),
						${payload}
					)::text
					);
					END IF;
					IF TG_OP = 'UPDATE' THEN
					PERFORM pg_notify(
					'${exports.listener_event_name}',
					json_build_object(
						'old', row_to_json(OLD),
						'new', row_to_json(NEW),
						${payload}
					)::text
					);
					END IF;
					IF TG_OP = 'DELETE' THEN
					PERFORM pg_notify(
					'${exports.listener_event_name}',
					json_build_object(
						'old', row_to_json(OLD),
						${payload}
					)::text
					);
					END IF;
					RETURN NEW;
					END
					$$
					LANGUAGE PLPGSQL;`;
                    if (q.delete) {
                        return function_1.default.formatSpace(drop);
                    }
                    else {
                        return function_1.default.formatSpace(drop + create);
                    }
                }
                return '';
            });
        }
        catch (e) {
            throw e;
        }
    },
    createTriggerListener() {
        try {
            return queries.map(q => {
                if (q.triggerOnTable && q.triggerOnTable.length > 0) {
                    return q.triggerOnTable.map(table => {
                        table = table.split('.').map(res => '"' + res + '"').join('.');
                        const drop = `DROP TRIGGER IF EXISTS trigger_event_listener_${q.name} ON ${table} CASCADE;`;
                        const create = `CREATE TRIGGER trigger_event_listener_${q.name}
						AFTER UPDATE OR INSERT OR DELETE ON ${table}
						FOR EACH ROW
						EXECUTE PROCEDURE "${schema_1.default.FUNCTION}".func_listener_${q.name}();`;
                        if (q.delete) {
                            return function_1.default.formatSpace(drop);
                        }
                        else {
                            return function_1.default.formatSpace(drop + create);
                        }
                    });
                }
                return [''];
            });
        }
        catch (e) {
            throw e;
        }
    },
};
