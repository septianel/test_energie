import schema from './schema'
import func from './function'


interface IndexingModel {
	schema: schema
	table: string
	columns: string[]
	type: 'INDEX' | 'UNIQUE'
	delete?: boolean
	replace_null_on_columns?: string[][]
}

const queries: IndexingModel[] = [
]

// ------------------------------------------------------------

export default {
	createIndexing() {
		return queries.map(q => {
			if (q.columns.length > 0) {
				const drop = `DROP INDEX IF EXISTS "${q.schema}"."indexing_${q.type === 'UNIQUE' ? 'unique_' : ''}${q.schema}_${q.table}" CASCADE;`
				const create = `CREATE ${q.type === 'UNIQUE' ? 'UNIQUE' : ''} INDEX indexing_${q.type === 'UNIQUE' ? 'unique_' : ''}${q.schema}_${q.table} ON "${q.schema}"."${q.table}" (${q.columns.map(col => {
					if (q.replace_null_on_columns) {
						const replace_null = q.replace_null_on_columns.find(i => i[0] === col)?.[1]
						return replace_null ? `COALESCE("${col}", ${replace_null})` : `"${col}"`
					}
					return `"${col}"`
				}).join(', ')});`
				if (q.delete) {
					return func.formatSpace(drop)
				} else {
					return func.formatSpace(drop + create)
				}
			}
			return ''
		})
	},
}
