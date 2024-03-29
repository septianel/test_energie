import RecordModel from '../models/record'

import {
    Column
} from 'typeorm'

import InterfaceModel from '../models/interface'
import { USER_STATUS } from 'utils/constants/enum'

export interface UserInterface extends InterfaceModel {
    BEGDA: string
    ENDDA: string
    USRNM: string
    STREE: string
    EMAIL: string
    PASWD: string
    STATS: USER_STATUS
    PHONE: string
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
    BEGDA: string

    @Column({
        nullable: false,
        unique: true
    })
    ENDDA: string

    @Column({
        nullable: false,
        unique: true
    })
    USRNM: string

    @Column({
        nullable: false,
        unique: true
    })
    STREE: string

    @Column({
        nullable: false,
        unique: true
    })
    EMAIL: string

    @Column({
        nullable: true,
    })
    PASWD: string

    @Column({
        nullable: false,
        default: USER_STATUS.ACTIVED,
        type: 'enum',
        enum: Object.values(USER_STATUS)
    })
    STATS: USER_STATUS

    @Column({
        nullable: true,
        unique: true
    })
    PHONE: string
    

    // ====================== TYPORM RELATION DEFINITION =======================
}

export default UserRecord
