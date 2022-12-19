import { DefaultNamingStrategy } from 'typeorm';
declare class NamingHelper extends DefaultNamingStrategy {
    foreignKeyNaming(): string[];
}
declare const _default: NamingHelper;
export default _default;
