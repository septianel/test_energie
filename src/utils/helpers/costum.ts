import func from './function'

interface CostumModel {
	costum_name: string
	query: string
}

const queries: CostumModel[] = [
	{
		costum_name: 'sales_report_transaction',
		query: ``,
	},
]

export default {
	createCostumQuery() {
		return queries.map(q => {
			return func.formatSpace(q.query)
		})
	},
}
