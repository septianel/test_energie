import InterfaceAddressModel, { Point } from './interface.address';
import RecordModel from './record';
export default class RecordAddressModel extends RecordModel implements InterfaceAddressModel {
    protected static columns: string[];
    location_id: number;
    title: string;
    receiver?: string;
    phone?: string;
    address: string;
    district?: string;
    postal: string;
    coords?: Point;
    metadata?: object;
    deleted_at?: Date;
}
