"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("./schema"));
const function_1 = __importDefault(require("./function"));
const queries = [];
exports.default = {
    createMaterializedView() {
        return queries.map(q => {
            if (!q.schema) {
                q.schema = schema_1.default.MVIEW;
            }
            q.query = function_1.default.formatSpace(q.query.split(';').join(''));
            q.query = q.query.split(' "').join('AS"');
            q.query = q.query.split('SELECTAS"').join('SELECT "');
            let splits = q.query.split(',');
            let splits2 = splits[0].split(' ');
            splits2[splits2.length - 1] = ' row_number() OVER () AS "unique", ' + splits2[splits2.length - 1];
            splits2 = splits2.join(' ');
            splits[0] = splits2;
            splits = splits.join(',');
            splits = splits.split('AS"').join(' "');
            q.query = splits;
            const drop = `DROP MATERIALIZED VIEW IF EXISTS "${q.schema}"."mv_${q.mview_name}" CASCADE;`;
            const create = `CREATE MATERIALIZED VIEW "${q.schema}"."mv_${q.mview_name}"
			AS `
                +
                    q.query
                +
                    ' WITH NO DATA;'
                +
                    `
			DROP VIEW IF EXISTS "${q.schema}"."mvw_${q.mview_name}" CASCADE;
			CREATE VIEW "${q.schema}"."mvw_${q.mview_name}"
			AS SELECT * FROM "${q.schema}"."mv_${q.mview_name}";`;
            if (q.delete) {
                return function_1.default.formatSpace(drop);
            }
            else {
                return function_1.default.formatSpace(drop + create);
            }
        });
    },
    indexingMaterializedView() {
        const index = queries.map(q => {
            if (q.triggerOnTable && q.triggerOnTable.length > 0) {
                const drop = `DROP INDEX IF EXISTS "${q.schema}"."mv_${q.mview_name}_indexing" CASCADE;`;
                const create = `CREATE UNIQUE INDEX mv_${q.mview_name}_indexing ON "${q.schema}"."mv_${q.mview_name}" ("unique");`;
                if (q.delete) {
                    return function_1.default.formatSpace(drop);
                }
                else {
                    return function_1.default.formatSpace(drop + create);
                }
            }
            return '';
        });
        queries.forEach(q => {
            if (q.indexOnColumn && q.indexOnColumn.length > 0) {
                q.indexOnColumn.forEach(col => {
                    const drop = `DROP INDEX IF EXISTS "${q.schema}"."mv_${q.mview_name}_${col}_indexing" CASCADE;`;
                    const create = `CREATE INDEX "mv_${q.mview_name}_${col}_indexing" ON "${q.schema}"."mv_${q.mview_name}" ("${col}");`;
                    if (q.delete) {
                        index.push(function_1.default.formatSpace(drop));
                    }
                    else {
                        index.push(function_1.default.formatSpace(drop + create));
                    }
                });
            }
        });
        return index;
    },
    createFunctionMaterializedView() {
        return queries.map(q => {
            if (q.triggerOnTable && q.triggerOnTable.length > 0) {
                const drop = `DROP FUNCTION IF EXISTS "${schema_1.default.FUNCTION}".func_listener_mv_${q.mview_name}() CASCADE;`;
                const create = `CREATE FUNCTION "${schema_1.default.FUNCTION}".func_listener_mv_${q.mview_name}() RETURNS TRIGGER
				AS $$
				BEGIN
				IF TG_OP = 'INSERT' THEN
				PERFORM pg_notify(
				'event_mv_listener',
				json_build_object(
					'new', row_to_json(NEW),
					'table',TG_TABLE_NAME::text,
					'type', TG_OP::text,
					'mview', '"${q.schema}"."mv_${q.mview_name}"'
				)::text
				);
				END IF;
				IF TG_OP = 'UPDATE' THEN
				PERFORM pg_notify(
				'event_mv_listener',
				json_build_object(
					'old', row_to_json(OLD),
					'new', row_to_json(NEW),
					'table', TG_TABLE_NAME::text,
					'type', TG_OP::text,
					'mview', '"${q.schema}"."mv_${q.mview_name}"'
				)::text
				);
				END IF;
				IF TG_OP = 'DELETE' THEN
				PERFORM pg_notify(
				'event_mv_listener',
				json_build_object(
					'old', row_to_json(OLD),
					'table', TG_TABLE_NAME::text,
					'type', TG_OP::text,
					'mview', '"${q.schema}"."mv_${q.mview_name}"'
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
    },
    createTriggerMaterializedView() {
        return queries.map(q => {
            if (q.triggerOnTable && q.triggerOnTable.length > 0) {
                return q.triggerOnTable.map(table => {
                    table = table.split('.').map(res => '"' + res + '"').join('.');
                    const drop = `DROP TRIGGER IF EXISTS trigger_event_mv_${q.mview_name} ON ${table} CASCADE;`;
                    const create = `CREATE TRIGGER trigger_event_mv_${q.mview_name}
					AFTER UPDATE OR INSERT OR DELETE ON ${table}
					FOR EACH ROW
					EXECUTE PROCEDURE "${schema_1.default.FUNCTION}".func_listener_mv_${q.mview_name}();`;
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
    },
    refreshMaterializedView() {
        return queries.map(q => {
            if (q.delete) {
                return function_1.default.formatSpace('');
            }
            else {
                return function_1.default.formatSpace(`REFRESH MATERIALIZED VIEW "${q.schema}"."mv_${q.mview_name}";`);
            }
        }).filter(i => !!i);
    },
};
