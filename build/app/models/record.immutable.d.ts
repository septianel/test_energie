import InterfaceImmutableModel from './interface.immutable';
import PlainRecordModel from './plain.record';
export default class RecordImmutableModel extends PlainRecordModel {
    protected static columns: string[];
    id: number;
    created_at: Date;
    deleted_at?: Date;
    aggregate(config: InterfaceImmutableModel): this;
    setId(id: number): this;
    setCreatedAt(created_at: Date): this;
    setDeletedAt(deleted_at: Date): this;
}
