import RecordModel from '../models/record'

import {
    Column
} from 'typeorm'

import InterfaceModel from '../models/interface'
import { USER_STATUS } from 'utils/constants/enum'

export interface UserInterface extends InterfaceModel {
    username: string
    email: string
    password: string
    status: USER_STATUS
}

export class UserRecord extends RecordModel implements Required<UserInterface> {

    public static table = {
        schema: 'app',
        name: 'user',
        comment: '@omit create,update,delete',
    }

    @Column({
        nullable: false,
        unique: true
    })
    username: string

    @Column({
        nullable: false,
        unique: true
    })
    email: string

    @Column({
        nullable: true,
    })
    password: string

    @Column({
        nullable: false,
        default: USER_STATUS.ACTIVED,
        type: 'enum',
        enum: Object.values(USER_STATUS)
    })
    status: USER_STATUS
    

    // ====================== TYPORM RELATION DEFINITION =======================
}

export default UserRecord
