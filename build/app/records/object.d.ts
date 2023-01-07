import RecordModel from '../models/record';
import InterfaceModel from '../models/interface';
export interface UserInterface extends InterfaceModel {
    BEGDA: string;
    ENDDA: string;
    BUSCD: string;
    OTYPE: string;
    STEXT: string;
    LTEXT: string;
}
export declare class UserRecord extends RecordModel implements Required<UserInterface> {
    static table: {
        schema: string;
        name: string;
        comment: string;
    };
    BEGDA: string;
    ENDDA: string;
    BUSCD: string;
    OTYPE: string;
    STEXT: string;
    LTEXT: string;
}
export default UserRecord;
