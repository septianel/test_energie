import PlainRecordModel from '../../app/models/plain.record'
import {
	Entity,
	getMetadataArgsStorage,
} from 'typeorm'
import { RelationMetadataArgs } from 'typeorm/metadata-args/RelationMetadataArgs'
import { JoinColumnMetadataArgs } from 'typeorm/metadata-args/JoinColumnMetadataArgs'

const comments = []
const materializedViews = []
const queries = []


export default {
	create(record: typeof PlainRecordModel) {
		const {
			comment,
			schema,
			name,
			materialize,
			customQueries,
		} = record.table

		if(comment) {
			comments.push({
				comment,
				schema,
				name,
			})
		}

		if(materialize) {
			materializedViews.push({
				materialize,
				schema,
				name,
			})
		}

		if(customQueries) {
			queries.push(...customQueries)
		}

		Entity({
			schema,
			name,
		})(record)

		return record
	},
	getCommentQueries() {
		// retrieve and delete
		return comments.splice(0, comments.length).map(({
			comment = '',
			schema = 'public',
			name,
		}) => {
			return `COMMENT ON TABLE "${schema}"."${name}" IS E'${comment}'`
		})
	},
	getMaterializedViewQueries() {
		return materializedViews.map(({
			materialize,
			schema,
			name,
		}) => {
			let query = `CREATE MATERIALIZED VIEW IF NOT EXISTS "${materialize.schema}"."${name}" AS (SELECT ${materialize.select ? materialize.select.map(select => {
				return `"${schema}"."${name}".${select}`
			}).join(', ') : '*'} FROM "${schema}"."${name}" ${materialize.where ? `WHERE ${materialize.where}` : ''} ${materialize.order ? materialize.order : ''});`

			if(materialize.id || materialize.foreignKeys) {
				query += `COMMENT ON MATERIALIZED VIEW "${materialize.schema}"."${name}" IS E'`

				if (materialize.id) {
					query += `@primaryKey ${materialize.id}\n`
				}

				if (materialize.foreignKeys) {
					Object.keys(materialize.foreignKeys).forEach(key => {
						if (typeof materialize.foreignKeys[key] === 'string') {
							query += `@foreignKey ("${key}") references "${materialize.schema}"."${materialize.foreignKeys[key]}" ("id")\n`
						} else {
							// object with { name, columnName }
							query += `@foreignKey ("${key}") references "${materialize.schema}"."${materialize.foreignKeys[key].name}" ("${materialize.foreignKeys[key].columnName}")\n`
						}
					})
				}

				query += '\';'
			}

			if(materialize.indexes) {
				materialize.indexes.forEach(index => {
					query += `CREATE INDEX ON "${materialize.schema}"."${name}"("${index}");`
				})
			}

			return query
		})
	},
	refreshMaterializedView() {
		// retrieve and delete
		return materializedViews.splice(0, materializedViews.length).map(({
			materialize,
			// schema,
			name,
		}) => {
			return `REFRESH MATERIALIZED VIEW "${materialize.schema}"."${name}"`
		})
	},
	runQueries() {
		return queries.splice(0, queries.length)
	},
	override(newTypeFn: () => typeof PlainRecordModel) {
		return (object: object, propertyName: string) => {
			const relationIndex = getMetadataArgsStorage().relations.findIndex((metadata: RelationMetadataArgs) => {
				const target = metadata.target as any
				return object instanceof target && metadata.propertyName === propertyName
			})

			if (relationIndex > -1) {
				const spliced = getMetadataArgsStorage().relations.splice(relationIndex, 1)[0]

				const joinColumnIndex = getMetadataArgsStorage().joinColumns.findIndex((metadata: RelationMetadataArgs) => {
					const target = metadata.target as any
					return object instanceof target && metadata.propertyName === propertyName
				})

				if(joinColumnIndex > -1) {
					const joinColumnMetadataArgs = getMetadataArgsStorage().joinColumns.splice(joinColumnIndex, 1)[0]

					getMetadataArgsStorage().joinColumns.push({
						target: object.constructor,
						propertyName,
						name: joinColumnMetadataArgs.name,
						referencedColumnName: joinColumnMetadataArgs.referencedColumnName,
					} as JoinColumnMetadataArgs)
				}

				getMetadataArgsStorage().relations.push({
					target: object.constructor,
					propertyName,
					// propertyType: reflectedType,
					relationType: spliced.relationType,
					isLazy: spliced.isLazy,
					type: newTypeFn,
					inverseSideProperty: spliced.inverseSideProperty,
					options: spliced.options,
				} as RelationMetadataArgs)
			}
		}
	},
}
