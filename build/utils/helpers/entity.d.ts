import PlainRecordModel from '../../app/models/plain.record';
declare const _default: {
    create(record: typeof PlainRecordModel): typeof PlainRecordModel;
    getCommentQueries(): string[];
    getMaterializedViewQueries(): string[];
    refreshMaterializedView(): string[];
    runQueries(): any[];
    override(newTypeFn: () => typeof PlainRecordModel): (object: object, propertyName: string) => void;
};
export default _default;
