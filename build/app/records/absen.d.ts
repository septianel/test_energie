import RecordModel from '../models/record';
import InterfaceModel from '../models/interface';
export interface UserInterface extends InterfaceModel {
    BEGDA: string;
    ENDDA: string;
    BUSCD: string;
    PERNR: string;
    CNAME: string;
    GENDR: string;
    CEKIN: string;
    CEOUT: string;
    PRSNT: string;
    DESCP: string;
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
    PERNR: string;
    CNAME: string;
    GENDR: string;
    CEKIN: string;
    CEOUT: string;
    PRSNT: string;
    DESCP: string;
}
export default UserRecord;
