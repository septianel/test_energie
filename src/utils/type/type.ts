import { InterfaceModel } from '../../app/models'

export type TypeMap<T, V> = {
    [Key in keyof T]: V
}

export type TypeMapToAny<T> = {
    [Key in keyof T]: any
}

export type TypeDateString<T> = {
    [Key in keyof T]: T[Key] extends Date ? string : T[Key]
}

export type TypeGenericFunction<T> = (...arg: any[]) => T


export type Mutable<T> = { -readonly [P in keyof T]: T[P] }

export type ArrayToObject<T extends readonly [...any]> = Mutable<{
    [Key in Uppercase<T[number]>]: T[number]
}>

export type TypeMapOptionalArray<T> = {
    [Key in keyof T]: T[Key] | Array<T[Key]>
}

export type TypeInsert<T> = Omit<T, [keyof InterfaceModel][number]> & Partial<InterfaceModel>
export type TypeUpdate<T> = Partial<T> & { id: number }
export type TypeDelete = { id: number }
