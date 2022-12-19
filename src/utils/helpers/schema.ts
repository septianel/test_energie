import { ArrayToObject } from 'utils/type/type'

const _Schemas = ['app', 'area', 'history', 'master', 'view', 'mview', 'other', 'public', 'function'] as const
type _Schemas = ArrayToObject<typeof _Schemas>
type Schemas = typeof _Schemas[number]
const Schemas: _Schemas = {
    APP: 'app',
    AREA: 'area',
    HISTORY: 'history',
    MASTER: 'master',
    VIEW: 'view',
    MVIEW: 'mview',
    OTHER: 'other',
    PUBLIC: 'public',
    FUNCTION: 'function',
}

export default Schemas
