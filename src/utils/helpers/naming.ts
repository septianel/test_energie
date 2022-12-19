import {
	DefaultNamingStrategy,
	// Table,
} from 'typeorm'


class NamingHelper extends DefaultNamingStrategy {

	foreignKeyNaming() {
		return [		].map(data => {
			return `COMMENT ON CONSTRAINT "${data.rel}" ON ${data.table} IS E\'${data.comment}\'`
		})
	}
}

export default new NamingHelper()
