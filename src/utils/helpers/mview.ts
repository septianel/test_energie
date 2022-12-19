import Schemas from './schema'
import func from './function'
interface MviewModel {
	mview_name: string
	schema?: Schemas
	triggerOnTable?: string[]
	indexOnColumn?: string[]
	query: string
	delete?: boolean
}

const queries: MviewModel[] = []


// --------------------------------------------------------------------------


export default {

	createMaterializedView() {
		return queries.map(q => {
			if (!q.schema) {
				q.schema = Schemas.MVIEW
			}
			q.query = func.formatSpace(q.query.split(';').join(''))
			q.query = q.query.split(' "').join('AS"')
			q.query = q.query.split('SELECTAS"').join('SELECT "')
			let splits = q.query.split(',')
			let splits2 = splits[0].split(' ')
			splits2[splits2.length - 1] = ' row_number() OVER () AS "unique", ' + splits2[splits2.length - 1]
			splits2 = splits2.join(' ') as any
			splits[0] = splits2 as any
			splits = splits.join(',') as any
			splits = (splits as any).split('AS"').join(' "')
			q.query = splits as any
			const drop = `DROP MATERIALIZED VIEW IF EXISTS "${q.schema}"."mv_${q.mview_name}" CASCADE;`
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
			AS SELECT * FROM "${q.schema}"."mv_${q.mview_name}";`
			if (q.delete) {
				return func.formatSpace(drop)
			} else {
				return func.formatSpace(drop + create)
			}
		})
	},

	indexingMaterializedView() {
		const index = queries.map(q => {
			if (q.triggerOnTable && q.triggerOnTable.length > 0) {
				const drop = `DROP INDEX IF EXISTS "${q.schema}"."mv_${q.mview_name}_indexing" CASCADE;`
				const create = `CREATE UNIQUE INDEX mv_${q.mview_name}_indexing ON "${q.schema}"."mv_${q.mview_name}" ("unique");`
				if (q.delete) {
					return func.formatSpace(drop)
				} else {
					return func.formatSpace(drop + create)
				}
			}
			return ''
		})
		queries.forEach(q => {
			if (q.indexOnColumn && q.indexOnColumn.length > 0) {
				q.indexOnColumn.forEach(col => {
					const drop = `DROP INDEX IF EXISTS "${q.schema}"."mv_${q.mview_name}_${col}_indexing" CASCADE;`
					const create = `CREATE INDEX "mv_${q.mview_name}_${col}_indexing" ON "${q.schema}"."mv_${q.mview_name}" ("${col}");`
					if (q.delete) {
						index.push(func.formatSpace(drop))
					} else {
						index.push(func.formatSpace(drop + create))
					}
				})
			}
		})
		return index
	},

	createFunctionMaterializedView() {
		return queries.map(q => {
			if (q.triggerOnTable && q.triggerOnTable.length > 0) {
				const drop = `DROP FUNCTION IF EXISTS "${Schemas.FUNCTION}".func_listener_mv_${q.mview_name}() CASCADE;`
				const create = `CREATE FUNCTION "${Schemas.FUNCTION}".func_listener_mv_${q.mview_name}() RETURNS TRIGGER
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
				LANGUAGE PLPGSQL;`
				if (q.delete) {
					return func.formatSpace(drop)
				} else {
					return func.formatSpace(drop + create)
				}
			}
			return ''
		})
	},

	createTriggerMaterializedView() {
		return queries.map(q => {
			if (q.triggerOnTable && q.triggerOnTable.length > 0) {
				return q.triggerOnTable.map(table => {
					table = table.split('.').map(res => '"' + res + '"').join('.')
					const drop = `DROP TRIGGER IF EXISTS trigger_event_mv_${q.mview_name} ON ${table} CASCADE;`
					const create = `CREATE TRIGGER trigger_event_mv_${q.mview_name}
					AFTER UPDATE OR INSERT OR DELETE ON ${table}
					FOR EACH ROW
					EXECUTE PROCEDURE "${Schemas.FUNCTION}".func_listener_mv_${q.mview_name}();`
					if (q.delete) {
						return func.formatSpace(drop)
					} else {
						return func.formatSpace(drop + create)
					}
				})
			}
			return ['']
		})
	},

	refreshMaterializedView() {
		return queries.map(q => {
			if (q.delete) {
				return func.formatSpace('')
			} else {
				return func.formatSpace(`REFRESH MATERIALIZED VIEW "${q.schema}"."mv_${q.mview_name}";`)
			}
		}).filter(i => !!i)
	},

}
