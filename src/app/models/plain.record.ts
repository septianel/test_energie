import BaseModel from './_base'

export class PlainRecordModel extends BaseModel {
	public static table: {
		schema: string,
		name: string,
		comment?: string,
		materialize?: {
			schema: string,
			where?: string,
			select?: string[],
			id?: string,
			foreignKeys?: {
				[key: string]: string | {
					name: string,
					columnName?: string,
				},
			},
			indexes?: string[],
		},
		customQueries?: string[],
	}

	protected static columns: string[] = []

	public get columns(): string[] {
		return (this as any).constructor.columns
	}

	public update<T extends this>(object: {
		[K in keyof T]?: T[K]
	}) {
		Object.keys(object).forEach(key => {
			if(object[key] !== undefined) {
				this[key] = object[key]
			}
		})

		return this
	}
}

export default PlainRecordModel
