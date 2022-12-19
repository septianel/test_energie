import InterfaceHistoryModel from './interface.history';
import PlainRecordModel from './plain.record';
export default class RecordHistoryModel extends PlainRecordModel {
    protected static columns: string[];
    id: number;
    created_at: Date;
    changer_user_id?: number;
    aggregate(config: InterfaceHistoryModel): this;
    setId(id: number): this;
    setCreatedAt(created_at: Date): this;
    setChangerUserId(changer_user_id: number): this;
}
