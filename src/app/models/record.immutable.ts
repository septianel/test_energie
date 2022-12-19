import InterfaceImmutableModel from './interface.immutable'
import PlainRecordModel from './plain.record'

import {
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
} from 'typeorm'


export default class RecordImmutableModel extends PlainRecordModel {

	protected static columns = [
		'id',
		'created_at',
		// 'deleted_at',
	]

	@PrimaryGeneratedColumn()
	public id: number

	@CreateDateColumn({
		type: 'timestamp with time zone',
	})
	public created_at: Date

	@Column({
		nullable: true,
		type: 'timestamp with time zone',
	})
	public deleted_at?: Date

	aggregate(config: InterfaceImmutableModel) {

		this.id = config.id
		this.created_at = config.created_at
		this.deleted_at = config.deleted_at

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

	setDeletedAt(deleted_at: Date) {
		this.deleted_at = deleted_at

		return this
	}
}
