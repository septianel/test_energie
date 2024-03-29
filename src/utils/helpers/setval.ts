import * as _Records from 'app/records'
import func from './function'
import { QueryRunner } from 'typeorm'

const Records = Object.values(_Records).map(record => record.default)


export default {

	async createSETVAL(qR: QueryRunner) {
		return await Promise.all(Records.map(async record => {
			const schema = record['table']['schema']
			const table = record['table']['name']
			const is_have_id = await qR.query(func.formatSpace(`SELECT c.column_name FROM information_schema.columns "c"
						WHERE c.table_schema = '${schema}'
						AND c.table_name = '${table}'`)).then(result => {
				return result.some(i => i.column_name === 'id')
			})
			if (is_have_id) {
				return await qR.query(func.formatSpace(`SELECT SETVAL('${schema}.${table}_id_seq', (SELECT COALESCE(MAX(id), 1) FROM "${schema}"."${table}"), CASE WHEN (SELECT MAX(id) FROM "${schema}"."${table}") ISNULL THEN FALSE ELSE TRUE END)`))
			}
			return
		}))
	},

}
