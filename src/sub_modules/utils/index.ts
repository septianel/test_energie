import { Request } from 'express'
import { isArray, trimObject } from './helpers/object'
import TimeHelper from './helpers/time'
//hehhehe
export function SQLString(text: string | any): string {
    return `'` + text + `'`
}

export function SQLSearch(text: string | any): string {
    return `'%` + text + `%'`
}

export function SQLIn(values: any[] | any): string {
    return '(' + (isArray(values) ? values.map((i: any) => SQLValue(i)) : SQLValue(values)) + ')'
}

export function SQLObject(text: string | any): string {
    return '"' + text + '"'
}

export function SQLValue(text: string | any): string {
    return (text instanceof Date) ? SQLString(TimeHelper.getCurrentYMD(text)) + '::TIMESTAMPTZ' : text === null ? 'NULL' : text === undefined ? 'NULL' : isNumber(text) ? text : isBoolean(text) ? text : SQLString(text)
}

export function SQLClean(string: any): string {
    return string.replace(/[\n|\r|\t]+/g, ' ').replace(/\s\s+/g, ' ').replace(/ ,/g, ',').replace(/, /g, ',').replace(/,  /g, ',').replace(/[;;]+/g, ';')
}

export function Try(func: () => any, catch_value?: any) {
    try {
        return func()
    } catch {
        return catch_value
    }
}

export function isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value)
}

export function isNumberOrNull(value: any): boolean {
    if (isNumber(value) || isNull(value)) {
        return true
    }
    return false
}

export function toNumber(value: any): number {
    return parseInt(value, 10)
}

export function rangeNumber(value: number, start: number, end: number): boolean {
    return value >= start && value <= end
}

export function isString(value: any): boolean {
    return typeof value === 'string'
}

export function toString(value: any): string {
    return value + ''
}

export function isBoolean(value: any): boolean {
    return value === true || value === false ? true : false
}

export function toBoolean(value: any): boolean {
    if (value === 'true') return true
    if (value === 'false') return false
    if (value === 1) return true
    if (value === 0) return false
    throw new Error(`toBoolean(): cannot convert value to boolean`)
}

export function isDate(value: any): boolean {
    return value instanceof Date
}

export function isNull(value: any): boolean {
    return value === null || value === undefined
}

export function replaceAll(string: string, old_value: string, new_value: string) {
    return string.replace(new RegExp(old_value, 'g'), new_value)
}

type TypeCostumPrimitive = 'NUMBER' | 'STRING' | 'BOOL' | 'DATE' | 'OBJECT' | 'ARRAY' | 'ENUM' | 'ANY'
function _parseQuery<T extends TypeCostumPrimitive>(value: any, type: T):
    T extends 'NUMBER' ? number :
    T extends 'STRING' ? string :
    T extends 'DATE' ? Date :
    T extends 'BOOL' ? boolean :
    T extends 'OBJECT' ? { [Key: string]: any } :
    T extends 'ARRAY' ? any[] :
    any {
    switch (type) {
        case 'NUMBER': {
            return isNull(value) ? undefined : toNumber(value) as any
        }
        case 'STRING': {
            return isNull(value) ? undefined : value
        }
        case 'BOOL': {
            return isNull(value) ? undefined : value === 'true' ? true : value === 'false' ? false : value
        }
        case 'DATE': {
            return isNull(value) ? undefined : TimeHelper.momentz(value).toDate() as any
        }
        case 'OBJECT': {
            return isNull(value) ? undefined : value
        }
        case 'ARRAY': {
            return isNull(value) ? undefined : isString(value) ? value.split(',') : value
        }
        case 'ENUM': {
            return isNull(value) ? undefined : value
        }
        case 'ANY': {
            return isNull(value) ? undefined : value
        }
        default: {
            throw new Error('Query type not valid!')
        }
    }
}

export function parseQuerys<T extends Record<string, TypeCostumPrimitive>>(req: Request, _object: T): {
    [Key in keyof T]:
    T[Key] extends 'NUMBER' ? number :
    T[Key] extends 'STRING' ? string :
    T[Key] extends 'DATE' ? Date :
    T[Key] extends 'BOOL' ? boolean :
    T[Key] extends 'OBJECT' ? { [Key: string]: any } :
    T[Key] extends 'ARRAY' ? any[] :
    any
} {
    return trimObject(Object.keys(_object).reduce((init, key) => {
        return {
            ...init,
            [key]: _parseQuery(req.query[key], _object[key])
        }
    }, {})) as any
}

export function parseRequest<T extends Record<string, TypeCostumPrimitive>>(req: { [key: string]: any }, _object: T): {
    [Key in keyof T]:
    T[Key] extends 'NUMBER' ? number :
    T[Key] extends 'STRING' ? string :
    T[Key] extends 'DATE' ? Date :
    T[Key] extends 'BOOL' ? boolean :
    T[Key] extends 'OBJECT' ? { [Key: string]: any } :
    T[Key] extends 'ARRAY' ? any[] :
    any
} {
    return trimObject(Object.keys(_object).reduce((init, key) => {
        return {
            ...init,
            [key]: _parseQuery(req[key], _object[key])
        }
    }, {})) as any
}

export function parseBody<T extends Record<string, 'NUMBER' | 'STRING' | 'BOOL' | 'DATE' | 'OBJECT' | 'ARRAY' | 'ENUM' | 'ANY'>>(req: Request, _object: T): {
    [Key in keyof T]:
    T[Key] extends 'NUMBER' ? number :
    T[Key] extends 'STRING' ? string :
    T[Key] extends 'DATE' ? Date :
    T[Key] extends 'BOOL' ? boolean :
    T[Key] extends 'OBJECT' ? { [Key: string]: any } :
    T[Key] extends 'ARRAY' ? any[] :
    any
} {
    return trimObject(Object.keys(_object).reduce((init, key) => {
        return {
            ...init,
            [key]: req.body[key]
        }
    }, {})) as any
}


