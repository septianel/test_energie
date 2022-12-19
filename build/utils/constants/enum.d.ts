import { ArrayToObject } from '../../utils/type/type';
declare const _USER_STATUS: readonly ["ACTIVED", "BLOCKED"];
type _USER_STATUS = ArrayToObject<typeof _USER_STATUS>;
export type USER_STATUS = typeof _USER_STATUS[number];
export declare const USER_STATUS: _USER_STATUS;
export {};
