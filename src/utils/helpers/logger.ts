import Defaults from 'utils/constants/default'
import {
	padEnd,
} from 'lodash'

const COLORS = {
	manager: '\x1b[1m\x1b[38;5;63m', // blue '#2838FE',
	record: '\x1b[1m\x1b[38;5;116m', // cyan '#6BDEDE',
	repository: '\x1b[1m\x1b[38;5;186m', // yellow '#CEC56F',
	server: '\x1b[1m\x1b[38;5;155m', // green '#A4EC41',
	error: '\x1b[1m\x1b[38;5;173m', // red '#d95232',
	logger: '\x1b[1m\x1b[38;5;244m', // '#888',
}
const VALID_TYPE = Object.keys(COLORS)
const NOOP: () => void = () => undefined

let CHARACTER = ':'
let LEFT_PAD = 2
let MAX_LENGTH = 13


export default {
	setType(type: string, color: string) {
		COLORS[type] = color

		if (VALID_TYPE.indexOf(type) === -1) {
			VALID_TYPE.push(type)
		}

		return this
	},

	removeType(type: string) {
		COLORS[type] = undefined

		delete COLORS[type]

		if (VALID_TYPE.indexOf(type) > -1) {
			VALID_TYPE.splice(VALID_TYPE.indexOf(type), 1)
		}

		return this
	},

	setCharacter(char: string) {
		CHARACTER = char

		return this
	},

	setLeftPad(number: number) {
		LEFT_PAD = number

		return this
	},

	setMaxLength(number: number) {
		MAX_LENGTH = number

		return this
	},

	getBase(stringBefore: number) {
		let _base = ''
		for (let i = 0; i < stringBefore; i++) {
			_base += CHARACTER
		}
		return _base
	},

	colonize(string: string) {
		if(typeof string !== 'string') { return 'Failed to colonize :' + string }
		return padEnd(`${this.getBase(LEFT_PAD)}${string.substr(0, MAX_LENGTH - LEFT_PAD - 1)}`, MAX_LENGTH, CHARACTER)
	},

	log(...arg: any[]) {
		if (Defaults.DEBUG) {
			const args = Array.from(arguments)
			const type = args.length > 1 && VALID_TYPE.indexOf(args[args.length - 1]) >= 0 && args.pop() || 'logger'

			switch (type) {
				case 'error':
					console.warn(...args)
					break
				default:
					const _type = VALID_TYPE.indexOf(type) > -1 ? type : 'logger'
					// tslint:disable-next-line: no-console
					console.log(COLORS[_type], this.colonize(_type), '\x1b[0m\x1b[22m', ...args)
					break
			}
		}
	},

	create(type: string, method: ('warn' | 'log') = 'log', moduleName: string) {
		if (Defaults.DEBUG) {
			const _type = VALID_TYPE.indexOf(type) > -1 ? type : 'logger'
			return console[method].bind(console, COLORS[_type], this.colonize(moduleName || _type), '\x1b[0m\x1b[22m')
		} else {
			return NOOP
		}
	},
}
