"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapper = exports.blackListKey = exports.distinctArray = exports.isEmptyObject = exports.isEmptyArray = exports.isObject = exports.isArray = exports.trimObject = exports.parseNull = void 0;
function Try(func, catch_value) {
    try {
        return func();
    }
    catch (_a) {
        return catch_value;
    }
}
function isObject(o) { return (!Array.isArray(o) && o instanceof Object && Try(() => JSON.stringify(o)[0] === '{', false)); }
exports.isObject = isObject;
function isArray(o) { return (Array.isArray(o)); }
exports.isArray = isArray;
function isEmptyObject(value) {
    return isObject(value) ? Object.keys(value).length < 1 : false;
}
exports.isEmptyObject = isEmptyObject;
function isEmptyArray(value) {
    return isArray(value) ? value.length < 1 : false;
}
exports.isEmptyArray = isEmptyArray;
function _parseNull(data) {
    try {
        const isTrim = (val) => val === undefined || isEmptyArray(val) || isEmptyObject(val) || (isNaN(val) && typeof val === 'number');
        if (isObject(data)) {
            const new_object = Object.keys(data).reduce((init, key) => {
                if (isTrim(data[key])) {
                    init[key] = null;
                    return init;
                }
                init[key] = parseNull(data[key]);
                return init;
            }, {});
            return isEmptyObject(new_object) ? null : new_object;
        }
        return isTrim(data) ? null : data;
    }
    catch (e) {
        throw e;
    }
}
function parseNull(data) {
    try {
        if (isEmptyArray(data)) {
            return null;
        }
        if (isEmptyObject(data)) {
            return null;
        }
        if (isObject(data)) {
            return _parseNull(data);
        }
        if (isArray(data)) {
            return data.map(_data => _parseNull(_data));
        }
        return _parseNull(data);
    }
    catch (e) {
        throw e;
    }
}
exports.parseNull = parseNull;
function trimObject(_object, option) {
    return Object.keys(_object).reduce((init, key) => {
        return Object.assign(Object.assign({}, init), _object[key] === undefined || _object[key] === ((option === null || option === void 0 ? void 0 : option.with_null) ? null : undefined) ? {} : {
            [key]: isObject(_object[key]) ? trimObject(_object[key]) : isArray(_object[key]) ? _object[key].map((i) => isObject(i) ? trimObject(i) : i) : _object[key]
        });
    }, {});
}
exports.trimObject = trimObject;
function distinctArray(array, key) {
    return key ? array.reduce((init, i) => {
        return init.some(_i => _i[key] === i[key]) ? init : [
            ...init,
            i
        ];
    }, []) : array.reduce((init, i) => {
        return init.some(_i => _i === i) ? init : [
            ...init,
            i
        ];
    }, []);
}
exports.distinctArray = distinctArray;
function blackListKey(object, black_list) {
    try {
        const _object = object;
        if (isArray(object)) {
            return object.map((i) => {
                return blackListKey(i, black_list);
            });
        }
        if (isObject(object)) {
            return Object.keys(_object).reduce((init, key) => {
                return Object.assign(Object.assign({}, init), black_list.includes(key) ? {} : {
                    [key]: isObject(_object[key]) ? blackListKey(_object[key], black_list) : isArray(_object[key]) ? _object[key].map((i) => blackListKey(i, black_list)) : _object[key]
                });
            }, {});
        }
        return object;
    }
    catch (e) {
        throw e;
    }
}
exports.blackListKey = blackListKey;
function mapper(obj, pattern, parrent_col, parrent_col_id, key_idx = 0) {
    try {
        const _isObject = (o) => (!Array.isArray(o) && o instanceof Object);
        const _isArray = (o) => (Array.isArray(o));
        const _col = Object.keys(pattern)[key_idx];
        const _col_id = _col + '_id';
        if (!_isArray(pattern[_col]) && !_isObject(pattern[_col])) {
            throw new Error(`'mapper' pattern must be Array or Object`);
        }
        if (_isArray(pattern[_col])) {
            pattern[_col].forEach(i => {
                if (!_isObject(i)) {
                    throw new Error(`'mapper' pattern not valid!`);
                }
            });
        }
        const _mapping = ({ __isArray } = {}) => {
            const _result = [...new Set(parrent_col_id && parrent_col ? obj.filter((i) => i[parrent_col] === parrent_col_id).map((i) => i[_col_id]) : obj.map((i) => i[_col_id]))].map(i => {
                const _object = obj.find((_i) => _i[_col_id] === i);
                const __map_obj = Object.keys(_object).filter((_i) => _i.substring(0, _col.length) === _col).reduce((ac, a) => (Object.assign(Object.assign({}, ac), { [a.replace((_col + '_'), '')]: _object[a] })), {});
                const __map_arr = Object.keys(__isArray ? (pattern[_col][0] ? pattern[_col][0] : []) : pattern[_col]).reduce((ac, a, _key_idx) => {
                    const _mapped = mapper(obj, __isArray ? pattern[_col][0] : pattern[_col], _col_id, i, _key_idx);
                    const _plural = _isArray(_mapped) ? '' : '';
                    return (Object.assign(Object.assign({}, ac), { [a + _plural]: _mapped }));
                }, {});
                return Object.values(__map_obj).some(_i => !!_i) ? Object.assign(Object.assign({}, __map_obj), __map_arr) : {};
            });
            const __result = __isArray ? _result : _result[0];
            if (_isArray(__result)) {
                if (__result.length <= 1) {
                    return Object.keys(__result[0]).length > 0 ? __result : null;
                }
                return __result;
            }
            else if (_isObject(__result)) {
                return Object.keys(__result).length > 0 ? __result : null;
            }
            return null;
        };
        if (_isArray(pattern[_col])) {
            return _mapping({ __isArray: true });
        }
        else if (_isObject(pattern[_col])) {
            return _mapping();
        }
        return undefined;
    }
    catch (e) {
        throw e;
    }
}
exports.mapper = mapper;
