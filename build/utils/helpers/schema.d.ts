import { ArrayToObject } from 'utils/type/type';
declare const _Schemas: readonly ["app", "area", "history", "master", "view", "mview", "other", "public", "function"];
type _Schemas = ArrayToObject<typeof _Schemas>;
type Schemas = typeof _Schemas[number];
declare const Schemas: _Schemas;
export default Schemas;
