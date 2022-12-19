import Schemas from './schema'
import func from './function'

class ViewModel {
	view_name: string
	schema?: Schemas = Schemas.VIEW
	query: string
	delete?: boolean
}

const queries: ViewModel[] = [
]

export default {
	createView() {
		return queries.map(q => {
			if (!q.schema) {
				q.schema = Schemas.VIEW
			}
			const drop = `DROP VIEW IF EXISTS "${q.schema}"."${q.view_name}" CASCADE;`
			const create = `CREATE VIEW "${q.schema}"."${q.view_name}" AS ${q.query}`
			if (q.delete) {
				return func.formatSpace(drop)
			} else {
				return func.formatSpace(drop + create)
			}
		})
	},
}
