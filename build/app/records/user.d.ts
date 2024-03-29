import RecordModel from '../models/record';
import InterfaceModel from '../models/interface';
import { USER_STATUS } from 'utils/constants/enum';
export interface UserInterface extends InterfaceModel {
    BEGDA: string;
    ENDDA: string;
    USRNM: string;
    STREE: string;
    EMAIL: string;
    PASWD: string;
    STATS: USER_STATUS;
    PHONE: string;
}
export declare class UserRecord extends RecordModel implements Required<UserInterface> {
    static table: {
        schema: string;
        name: string;
        comment: string;
    };
    BEGDA: string;
    ENDDA: string;
    USRNM: string;
    STREE: string;
    EMAIL: string;
    PASWD: string;
    STATS: USER_STATUS;
    PHONE: string;
}
export default UserRecord;
