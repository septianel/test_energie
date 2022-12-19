import InterfaceHistoryModel from './interface.history'
import PlainRecordModel from './plain.record'

import {
	Column, PrimaryGeneratedColumn, CreateDateColumn, Index,
} from 'typeorm'


export default class RecordHistoryModel extends PlainRecordModel {

	protected static columns = [
		'id',
		'created_at',
		'changer_user_id',
	]

	@PrimaryGeneratedColumn()
	public id: number

	@CreateDateColumn({
		type: 'timestamp with time zone',
	})
	public created_at: Date

	@Index()
	@Column({
		nullable: true,
	})
	public changer_user_id?: number

	aggregate(config: InterfaceHistoryModel) {

		this.id = config.id
		this.created_at = config.created_at
		this.changer_user_id = config.changer_user_id

		return this
	}

	setId(id: number) {
		this.id = id

		return this
	}

	setCreatedAt(created_at: Date) {
		this.created_at = created_at

		return this
	}

	setChangerUserId(changer_user_id: number) {
		this.changer_user_id = changer_user_id

		return this
	}

}
