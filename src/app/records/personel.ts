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
    NICNM: string
    BRNCT: string
    BRNDT: string
    GENDR: string
    RELIG: string
}

export class UserRecord extends RecordModel implements Required<UserInterface> {

    public static table = {
        schema: 'app',
        name: 'personel',
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
    NICNM: string

    @Column({
        nullable: false,
        unique: true
    })
    BRNCT: string

    @Column({
        nullable: false,
        unique: true
    })
    BRNDT: string

    @Column({
        nullable: false,
        unique: true
    })
    GENDR: string

    @Column({
        nullable: false,
        unique: true
    })
    RELIG: string

    // ====================== TYPORM RELATION DEFINITION =======================
}

export default UserRecord
