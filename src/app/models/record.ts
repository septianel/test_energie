import PlainRecordModel from './plain.record'

import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { TriggerInterface } from 'utils/helpers/trigger'


export default class RecordModel extends PlainRecordModel {

	public static depends_on: string

	protected static columns = [
		'id',
		'created_at',
		'updated_at',
	]


	@PrimaryGeneratedColumn()
	public id: number

	@CreateDateColumn({
		type: 'timestamp with time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	public created_at: Date

	@UpdateDateColumn({
		nullable: true,
		type: 'timestamp with time zone',
	})
	public updated_at: Date

	public seeder(): { [Key: string]: any }[] {
		return []
	}

	async trigger(): TriggerInterface {
		return []
	}
}
