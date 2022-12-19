

export default class ERROR {
	error_list: string[] = []

	CODE(code: string) {
		if (this.error_list.some(i => i === code)) {
			throw new Error(`ERR.CODE (${code}) is duplicate!`)
		}
		this.error_list = [...this.error_list, code]
		return code
	}
}


// ---------------------------------------------------------------------------
