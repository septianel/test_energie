import InterfaceModel from './interface'

export interface Point {
	x: number
	y: number
}

interface InterfaceAddressModel extends InterfaceModel {
	location_id: number
	title: string
	receiver?: string
	phone?: string
	address: string
	district?: string
	postal: string
	coords?: Point
	metadata?: object
	deleted_at?: Date
}

export default InterfaceAddressModel
