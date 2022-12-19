"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const prompt_1 = __importDefault(require("prompt"));
const _Records = __importStar(require("./records"));
const Records = Object.values(_Records).map(record => record.default);
const default_1 = __importDefault(require("../utils/constants/default"));
const entity_1 = __importDefault(require("../utils/helpers/entity"));
const logger_1 = __importDefault(require("../utils/helpers/logger"));
const naming_1 = __importDefault(require("../utils/helpers/naming"));
const view_1 = __importDefault(require("../utils/helpers/view"));
const mview_1 = __importDefault(require("../utils/helpers/mview"));
const listener_1 = __importDefault(require("../utils/helpers/listener"));
const indexing_1 = __importDefault(require("../utils/helpers/indexing"));
const trigger_1 = __importDefault(require("../utils/helpers/trigger"));
const procedure_1 = __importDefault(require("../utils/helpers/procedure"));
const seeder_1 = __importDefault(require("../utils/helpers/seeder"));
const setval_1 = __importDefault(require("../utils/helpers/setval"));
const schema_1 = __importDefault(require("../utils/helpers/schema"));
const Prompt = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        {
            prompt_1.default.start();
            const message = `you're currently connected on DB ${process.env.DB_HOST}!\nare you sure to continue? (type 'yes' to continue)`;
            return prompt_1.default.get([message], (error, result) => {
                if (error) {
                    return reject(error);
                }
                if (['yes'].includes(Object.values(result)[0].toLocaleLowerCase())) {
                    return resolve(true);
                }
                else {
                    return reject('failed!');
                }
            });
        }
    });
});
exports.default = {
    init(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.DB_HOST.includes('production')) {
                yield Prompt();
            }
            logger_1.default.log('try to connect on DB ' + process.env.DB_HOST);
            const _command = command[0];
            const is_all = _command === 'all';
            return (0, typeorm_1.createConnection)({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT, 10),
                database: process.env.DB_NAME,
                username: process.env.DB_USER,
                password: process.env.DB_PASS,
                logging: default_1.default.DEBUG,
                synchronize: process.env.SYNC === 'true',
                namingStrategy: naming_1.default,
            }).then((connection) => __awaiter(this, void 0, void 0, function* () {
                if (default_1.default.DEBUG) {
                    logger_1.default.log('server', 'Connection has been established successfully!', connection);
                }
                const qR = connection.createQueryRunner();
                yield qR.connect();
                yield qR.startTransaction();
                try {
                    if (is_all) {
                        yield qR.query(`SET TIME ZONE 'Asia/Jakarta'`);
                        yield qR.query('CREATE EXTENSION IF NOT EXISTS pg_trgm');
                    }
                    if (is_all) {
                        yield Promise.all(Object.values(schema_1.default).map((enumss) => __awaiter(this, void 0, void 0, function* () {
                            return qR.query(`CREATE SCHEMA IF NOT EXISTS ${enumss}`);
                        })));
                    }
                    yield qR.commitTransaction();
                    yield qR.release();
                    yield connection.destroy();
                }
                catch (e) {
                    logger_1.default.log(e);
                    yield qR.rollbackTransaction();
                    yield qR.release();
                }
                return (0, typeorm_1.createConnection)(Object.assign({ type: 'postgres', host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT, 10), database: process.env.DB_NAME, username: process.env.DB_USER, password: process.env.DB_PASS, logging: default_1.default.DEBUG, synchronize: process.env.SYNC === 'true', namingStrategy: naming_1.default }, is_all ? {
                    entities: Object.keys(Records).map(key => entity_1.default.create(Records[key])),
                } : {}));
            })).then((connection) => __awaiter(this, void 0, void 0, function* () {
                if (default_1.default.DEBUG) {
                    logger_1.default.log('server', 'Connection has been established successfully!');
                }
                const qR = connection.createQueryRunner();
                yield qR.connect();
                yield qR.startTransaction();
                try {
                    if (is_all) {
                        for (const comment of entity_1.default.getCommentQueries()) {
                            logger_1.default.log('server', 'Creating Comment Foreign Keys');
                            yield qR.query(comment);
                        }
                    }
                    if (is_all) {
                        for (const query of entity_1.default.runQueries()) {
                            yield qR.query(query);
                        }
                    }
                    if (is_all) {
                        for (const query of naming_1.default.foreignKeyNaming()) {
                            yield qR.query(query);
                        }
                    }
                    if (is_all) {
                        for (const query of listener_1.default.createFunctionListener()) {
                            yield qR.query(query);
                        }
                        for (const query of listener_1.default.createTriggerListener()) {
                            for (const trigger of query) {
                                yield qR.query(trigger);
                            }
                        }
                    }
                    if (is_all || _command === 'trigger') {
                        for (const query of yield trigger_1.default.createTRIGGER(qR)) {
                            for (const trigger of query) {
                                for (const Q of trigger) {
                                    yield qR.query(Q);
                                }
                            }
                        }
                    }
                    if (is_all || _command === 'indexing') {
                        for (const query of indexing_1.default.createIndexing()) {
                            yield qR.query(query);
                        }
                    }
                    if (is_all || _command === 'procedure') {
                        for (const query of procedure_1.default.createProcedure()) {
                            yield qR.query(query);
                        }
                    }
                    if (is_all || _command === 'seeder') {
                        for (const query of seeder_1.default.createSEEDER()) {
                            for (const Q of query) {
                                yield qR.query(Q);
                            }
                        }
                    }
                    if (is_all) {
                        for (const query of view_1.default.createView()) {
                            yield qR.query(query);
                        }
                    }
                    if (is_all) {
                        for (const query of entity_1.default.getMaterializedViewQueries()) {
                            yield qR.query(query);
                        }
                        for (const query of mview_1.default.createMaterializedView()) {
                            yield qR.query(query);
                        }
                        for (const query of mview_1.default.indexingMaterializedView()) {
                            yield qR.query(query);
                        }
                        for (const query of mview_1.default.createFunctionMaterializedView()) {
                            yield qR.query(query);
                        }
                        for (const query of mview_1.default.createTriggerMaterializedView()) {
                            for (const trigger of query) {
                                yield qR.query(trigger);
                            }
                        }
                    }
                    if (is_all) {
                        for (const query of entity_1.default.refreshMaterializedView()) {
                            yield qR.query(query);
                        }
                        for (const query of mview_1.default.refreshMaterializedView()) {
                            yield qR.query(query);
                        }
                    }
                    if (is_all || _command === 'setval') {
                        yield setval_1.default.createSETVAL(qR);
                    }
                    yield qR.commitTransaction();
                    yield qR.release();
                    logger_1.default.log();
                    logger_1.default.log('Success serve on DB ' + process.env.DB_HOST + ' .......');
                    logger_1.default.log();
                    return connection;
                }
                catch (e) {
                    logger_1.default.log(e);
                    yield qR.rollbackTransaction();
                    yield qR.release();
                }
            }));
        });
    },
};
