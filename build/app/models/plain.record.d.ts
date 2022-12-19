import BaseModel from './_base';
export declare class PlainRecordModel extends BaseModel {
    static table: {
        schema: string;
        name: string;
        comment?: string;
        materialize?: {
            schema: string;
            where?: string;
            select?: string[];
            id?: string;
            foreignKeys?: {
                [key: string]: string | {
                    name: string;
                    columnName?: string;
                };
            };
            indexes?: string[];
        };
        customQueries?: string[];
    };
    protected static columns: string[];
    get columns(): string[];
    update<T extends this>(object: {
        [K in keyof T]?: T[K];
    }): this;
}
export default PlainRecordModel;
