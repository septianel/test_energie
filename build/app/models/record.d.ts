import PlainRecordModel from './plain.record';
import { TriggerInterface } from 'utils/helpers/trigger';
export default class RecordModel extends PlainRecordModel {
    static depends_on: string;
    protected static columns: string[];
    id: number;
    created_at: Date;
    updated_at: Date;
    seeder(): {
        [Key: string]: any;
    }[];
    trigger(): TriggerInterface;
}
