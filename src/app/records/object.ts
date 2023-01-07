import RecordModel from '../models/record'

import {
    Column
} from 'typeorm'

import InterfaceModel from '../models/interface'
// import { USER_STATUS } from 'utils/constants/enum'

export interface UserInterface extends InterfaceModel {
    BEGDA: string
    ENDDA: string
    BUSCD: string
    OTYPE: string
    STEXT: string
    LTEXT: string
}

export class UserRecord extends RecordModel implements Required<UserInterface> {

    public static table = {
        schema: 'app',
        name: 'object',
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
    BUSCD: string

    @Column({
        nullable: false,
        unique: true
    })
    OTYPE: string

    @Column({
        nullable: false,
        unique: true
    })
    STEXT: string

    @Column({
        nullable: false,
        unique: true
    })
    LTEXT: string

    // ====================== TYPORM RELATION DEFINITION =======================
}

export default UserRecord
