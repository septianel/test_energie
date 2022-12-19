declare abstract class BaseModel {
    protected static __displayName: string;
    protected static __type: string;
    protected static __log: (...args: any[]) => void;
    protected static __warn: (...args: any[]) => void;
    protected static get log(): (...args: any[]) => void;
    protected static get warn(): (...args: any[]) => void;
    constructor(autobinds?: string[]);
    get __displayName(): string;
    get __type(): string;
    get log(): (...args: any[]) => void;
    get warn(): (...args: any[]) => void;
}
export default BaseModel;
