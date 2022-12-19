import LoggerHelper from '../../utils/helpers/logger'


abstract class BaseModel {
	protected static __displayName: string
	protected static __type: string
	protected static __log: (...args: any[]) => void
	protected static __warn: (...args: any[]) => void

	protected static get log(): (...args: any[]) => void {
		if(!this.__log) { this.__log = LoggerHelper.create(this.__type, 'log', this.__displayName || this.name) }
		return this.__log
	}

	protected static get warn(): (...args: any[]) => void {
		if (!this.__warn) { this.__warn = LoggerHelper.create('error', 'warn', this.__displayName || this.name) }
		return this.__warn
	}

	constructor(autobinds: string[] = []) {

		autobinds.forEach(m => {
			this[m] = this[m].bind(this)
		})

		return this
	}

	get __displayName(): string {
		return (this as any).constructor.__displayName || this.constructor.name
	}

	get __type(): string {
		return (this as any).constructor.__type
	}

	get log(): (...args: any[]) => void {
		return (this as any).constructor.log
	}

	get warn(): (...args: any[]) => void {
		return (this as any).constructor.warn
	}
}

export default BaseModel
