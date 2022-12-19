"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const comments = [];
const materializedViews = [];
const queries = [];
exports.default = {
    create(record) {
        const { comment, schema, name, materialize, customQueries, } = record.table;
        if (comment) {
            comments.push({
                comment,
                schema,
                name,
            });
        }
        if (materialize) {
            materializedViews.push({
                materialize,
                schema,
                name,
            });
        }
        if (customQueries) {
            queries.push(...customQueries);
        }
        (0, typeorm_1.Entity)({
            schema,
            name,
        })(record);
        return record;
    },
    getCommentQueries() {
        return comments.splice(0, comments.length).map(({ comment = '', schema = 'public', name, }) => {
            return `COMMENT ON TABLE "${schema}"."${name}" IS E'${comment}'`;
        });
    },
    getMaterializedViewQueries() {
        return materializedViews.map(({ materialize, schema, name, }) => {
            let query = `CREATE MATERIALIZED VIEW IF NOT EXISTS "${materialize.schema}"."${name}" AS (SELECT ${materialize.select ? materialize.select.map(select => {
                return `"${schema}"."${name}".${select}`;
            }).join(', ') : '*'} FROM "${schema}"."${name}" ${materialize.where ? `WHERE ${materialize.where}` : ''} ${materialize.order ? materialize.order : ''});`;
            if (materialize.id || materialize.foreignKeys) {
                query += `COMMENT ON MATERIALIZED VIEW "${materialize.schema}"."${name}" IS E'`;
                if (materialize.id) {
                    query += `@primaryKey ${materialize.id}\n`;
                }
                if (materialize.foreignKeys) {
                    Object.keys(materialize.foreignKeys).forEach(key => {
                        if (typeof materialize.foreignKeys[key] === 'string') {
                            query += `@foreignKey ("${key}") references "${materialize.schema}"."${materialize.foreignKeys[key]}" ("id")\n`;
                        }
                        else {
                            query += `@foreignKey ("${key}") references "${materialize.schema}"."${materialize.foreignKeys[key].name}" ("${materialize.foreignKeys[key].columnName}")\n`;
                        }
                    });
                }
                query += '\';';
            }
            if (materialize.indexes) {
                materialize.indexes.forEach(index => {
                    query += `CREATE INDEX ON "${materialize.schema}"."${name}"("${index}");`;
                });
            }
            return query;
        });
    },
    refreshMaterializedView() {
        return materializedViews.splice(0, materializedViews.length).map(({ materialize, name, }) => {
            return `REFRESH MATERIALIZED VIEW "${materialize.schema}"."${name}"`;
        });
    },
    runQueries() {
        return queries.splice(0, queries.length);
    },
    override(newTypeFn) {
        return (object, propertyName) => {
            const relationIndex = (0, typeorm_1.getMetadataArgsStorage)().relations.findIndex((metadata) => {
                const target = metadata.target;
                return object instanceof target && metadata.propertyName === propertyName;
            });
            if (relationIndex > -1) {
                const spliced = (0, typeorm_1.getMetadataArgsStorage)().relations.splice(relationIndex, 1)[0];
                const joinColumnIndex = (0, typeorm_1.getMetadataArgsStorage)().joinColumns.findIndex((metadata) => {
                    const target = metadata.target;
                    return object instanceof target && metadata.propertyName === propertyName;
                });
                if (joinColumnIndex > -1) {
                    const joinColumnMetadataArgs = (0, typeorm_1.getMetadataArgsStorage)().joinColumns.splice(joinColumnIndex, 1)[0];
                    (0, typeorm_1.getMetadataArgsStorage)().joinColumns.push({
                        target: object.constructor,
                        propertyName,
                        name: joinColumnMetadataArgs.name,
                        referencedColumnName: joinColumnMetadataArgs.referencedColumnName,
                    });
                }
                (0, typeorm_1.getMetadataArgsStorage)().relations.push({
                    target: object.constructor,
                    propertyName,
                    relationType: spliced.relationType,
                    isLazy: spliced.isLazy,
                    type: newTypeFn,
                    inverseSideProperty: spliced.inverseSideProperty,
                    options: spliced.options,
                });
            }
        };
    },
};
