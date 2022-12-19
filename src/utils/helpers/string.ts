export function splitCamel(string: string) {
	return string && string.split(/(?<=[a-z])(?=[A-Z])/) || []
}

export function pluralize(num: number, word: string = 'ITEM', emptyString: string = '', plural: string = 'S') {
	return emptyString && !num ? emptyString : `${num} ${word}${num > 1 ? plural : ''}`
}

export default {
	splitCamel,
	pluralize,
}
