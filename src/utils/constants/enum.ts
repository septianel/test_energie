import { ArrayToObject } from '../../utils/type/type'

const _USER_STATUS = ['ACTIVED', 'BLOCKED'] as const
type _USER_STATUS = ArrayToObject<typeof _USER_STATUS>
export type USER_STATUS = typeof _USER_STATUS[number]
export const USER_STATUS: _USER_STATUS = {
	ACTIVED: 'ACTIVED',
	BLOCKED: 'BLOCKED',
}
