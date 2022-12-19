import InterfaceAddressModel, { Point } from './interface.address'
import RecordModel from './record'

import {
	Column,
} from 'typeorm'

export default class RecordAddressModel extends RecordModel implements InterfaceAddressModel {

	protected static columns = [
		...RecordModel.columns,
		'title',
		'receiver',
		'phone',
		'address',
		'district',
		'postal',
		'coords',
		'metadata',
		'location_id',
	]
	@Column({
		nullable: false,
	})
	location_id: number

	@Column({
		length: 126,
		nullable: false,
	})
	title: string

	@Column({
		length: 126,
		nullable: true,
	})
	receiver?: string

	@Column({
		length: 31,
		nullable: true,
	})
	phone?: string

	@Column({
		nullable: false,
		type: 'text',
	})
	address: string

	@Column({
		length: 126,
		nullable: true,
	})
	district?: string

	@Column({
		length: 15,
		nullable: false,
	})
	postal: string

	@Column({
		type: 'point',
		nullable: true,
	})
	coords?: Point

	@Column({
		default: {},
		nullable: true,
		type: 'jsonb',
	})
	public metadata?: object

	@Column({
		nullable: true,
		type: 'timestamp with time zone',
	})
	public deleted_at?: Date

}
