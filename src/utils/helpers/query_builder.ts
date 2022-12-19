export default {
	select(record: any, fromAs: string, prefixFromAs: boolean = false, withDoubleQuote: boolean = false) {
		let prefix = record['table']['name']
		if (prefixFromAs) {
			prefix = fromAs
		}
		if (withDoubleQuote) {
			fromAs = '"' + fromAs + '"'
		}
		return record['columns'].map(column => {
			return `${fromAs}."${column}" "${prefix}_${column}"`
		}).join(', ')
	},
}
