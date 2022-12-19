import RecordModel from '../models/record';
import InterfaceModel from '../models/interface';
import { USER_STATUS } from 'utils/constants/enum';
export interface UserInterface extends InterfaceModel {
    username: string;
    email: string;
    password: string;
    status: USER_STATUS;
}
export declare class UserRecord extends RecordModel implements Required<UserInterface> {
    static table: {
        schema: string;
        name: string;
        comment: string;
    };
    username: string;
    email: string;
    password: string;
    status: USER_STATUS;
}
export default UserRecord;
