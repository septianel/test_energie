declare function isObject(o: object): any;
declare function isArray(o: object): boolean;
declare function isEmptyObject(value: Record<string, any>): boolean;
declare function isEmptyArray(value: any[]): boolean;
declare function parseNull(data: Record<string, any> | any[]): Record<string, any>;
declare function trimObject<T extends Record<string, any>>(_object: T, option?: {
    with_null: boolean;
}): {
    [Key in keyof T]: T[Key];
};
declare function distinctArray<T extends ({
    [key: string]: any;
}[])>(array: T, key: keyof T[number]): T;
declare function distinctArray<T extends any[]>(array: T): T;
declare function blackListKey<T extends Record<string, any> | Record<string, any>[]>(object: T, black_list: string[]): T;
declare function mapper(obj: {
    [key: string]: any;
}[], pattern: {
    [key: string]: any;
}, parrent_col?: string, parrent_col_id?: number, key_idx?: number): any;
export { parseNull, trimObject, isArray, isObject, isEmptyArray, isEmptyObject, distinctArray, blackListKey, mapper };
