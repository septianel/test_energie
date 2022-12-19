import func from './function'

interface ProcedureModel {
	query: string,
	drop: string,
	delete?: boolean
}

const queries: ProcedureModel[] = [
]



// ---------------------------------------------------------------------------


export default {
	createProcedure() {
		return queries.map(q => func.formatSpace(q.delete ? q.drop : (q.drop + q.query)))
	},
}
