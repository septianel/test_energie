import { Request } from 'express';
export declare function SQLString(text: string | any): string;
export declare function SQLSearch(text: string | any): string;
export declare function SQLIn(values: any[] | any): string;
export declare function SQLObject(text: string | any): string;
export declare function SQLValue(text: string | any): string;
export declare function SQLClean(string: any): string;
export declare function Try(func: () => any, catch_value?: any): any;
export declare function isNumber(value: any): boolean;
export declare function isNumberOrNull(value: any): boolean;
export declare function toNumber(value: any): number;
export declare function rangeNumber(value: number, start: number, end: number): boolean;
export declare function isString(value: any): boolean;
export declare function toString(value: any): string;
export declare function isBoolean(value: any): boolean;
export declare function toBoolean(value: any): boolean;
export declare function isDate(value: any): boolean;
export declare function isNull(value: any): boolean;
export declare function replaceAll(string: string, old_value: string, new_value: string): string;
type TypeCostumPrimitive = 'NUMBER' | 'STRING' | 'BOOL' | 'DATE' | 'OBJECT' | 'ARRAY' | 'ENUM' | 'ANY';
export declare function parseQuerys<T extends Record<string, TypeCostumPrimitive>>(req: Request, _object: T): {
    [Key in keyof T]: T[Key] extends 'NUMBER' ? number : T[Key] extends 'STRING' ? string : T[Key] extends 'DATE' ? Date : T[Key] extends 'BOOL' ? boolean : T[Key] extends 'OBJECT' ? {
        [Key: string]: any;
    } : T[Key] extends 'ARRAY' ? any[] : any;
};
export declare function parseRequest<T extends Record<string, TypeCostumPrimitive>>(req: {
    [key: string]: any;
}, _object: T): {
    [Key in keyof T]: T[Key] extends 'NUMBER' ? number : T[Key] extends 'STRING' ? string : T[Key] extends 'DATE' ? Date : T[Key] extends 'BOOL' ? boolean : T[Key] extends 'OBJECT' ? {
        [Key: string]: any;
    } : T[Key] extends 'ARRAY' ? any[] : any;
};
export declare function parseBody<T extends Record<string, 'NUMBER' | 'STRING' | 'BOOL' | 'DATE' | 'OBJECT' | 'ARRAY' | 'ENUM' | 'ANY'>>(req: Request, _object: T): {
    [Key in keyof T]: T[Key] extends 'NUMBER' ? number : T[Key] extends 'STRING' ? string : T[Key] extends 'DATE' ? Date : T[Key] extends 'BOOL' ? boolean : T[Key] extends 'OBJECT' ? {
        [Key: string]: any;
    } : T[Key] extends 'ARRAY' ? any[] : any;
};
export {};
