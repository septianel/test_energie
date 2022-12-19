import { QueryRunner } from 'typeorm';
interface TriggerModel {
    name: string;
    time: 'BEFORE' | 'AFTER';
    method: Array<'UPDATE' | 'INSERT' | 'DELETE'>;
    query: string | ((qR: QueryRunner) => Promise<string>);
    variable?: string;
    delete?: boolean;
}
export type TriggerInterface = Promise<TriggerModel[]>;
declare const _default: {
    createTRIGGER(qR: QueryRunner): Promise<string[][][]>;
};
export default _default;
