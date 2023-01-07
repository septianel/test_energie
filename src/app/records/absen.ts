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
    PERNR: string
    CNAME: string
    GENDR: string
    CEKIN: string
    CEOUT: string
    PRSNT: string
    DESCP: string
}

export class UserRecord extends RecordModel implements Required<UserInterface> {

    public static table = {
        schema: 'app',
        name: 'absen',
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
    PERNR: string


    @Column({
        nullable: false,
        unique: true
    })
    CNAME: string

    @Column({
        nullable: false,
        unique: true
    })
    GENDR: string

    @Column({
        nullable: false,
        unique: true
    })
    CEKIN: string

    @Column({
        nullable: false,
        unique: true
    })
    CEOUT: string

    @Column({
        nullable: false,
        unique: true
    })
    PRSNT: string

    @Column({
        nullable: false,
        unique: true
    })
    DESCP: string

    // ====================== TYPORM RELATION DEFINITION =======================
}

export default UserRecord
