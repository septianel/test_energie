import {
	createConnection,
} from 'typeorm'
import prompt from 'prompt'

import * as _Records from './records'

const Records = Object.values(_Records).map(record => record.default)

import Defaults from '../utils/constants/default'
import EntityHelper from '../utils/helpers/entity'
import LoggerHelper from '../utils/helpers/logger'
import NamingHelper from '../utils/helpers/naming'

import ViewHelper from '../utils/helpers/view'
import MviewHelper from '../utils/helpers/mview'
import ListenerHelper from '../utils/helpers/listener'
import IndexingHelper from '../utils/helpers/indexing'
import TriggerHelper from '../utils/helpers/trigger'
import ProcedureHelper from '../utils/helpers/procedure'
import SeederHelper from '../utils/helpers/seeder'
import SetvalHelper from '../utils/helpers/setval'

import Schemas from '../utils/helpers/schema'

const Prompt = async () => {
	return new Promise((resolve, reject) => {
		{
			prompt.start()

			const message = `you're currently connected on DB ${process.env.DB_HOST}!\nare you sure to continue? (type 'yes' to continue)`

			return prompt.get([message], (error, result) => {
				if (error) {
					return reject(error)
				}
				if(['yes'].includes((Object.values(result)[0] as string).toLocaleLowerCase())) {
					return resolve(true)
				} else {
					return reject('failed!')
				}
			})
		}
	})
}


export default {
	async init(command: string[]) {

		if (process.env.DB_HOST.includes('production')) {
			await Prompt()
		}

		LoggerHelper.log('try to connect on DB ' + process.env.DB_HOST)
		const _command = command[0]
		const is_all = _command === 'all'
		return createConnection({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT, 10),
			database: process.env.DB_NAME,
			username: process.env.DB_USER,
			password: process.env.DB_PASS,
			logging: Defaults.DEBUG,
			synchronize: process.env.SYNC === 'true',
			namingStrategy: NamingHelper,
		}).then(async connection => {

			if (Defaults.DEBUG) {
				LoggerHelper.log('server', 'Connection has been established successfully!', connection)
			}

			const qR = connection.createQueryRunner()
			await qR.connect()
			await qR.startTransaction()

			try {
				if (is_all) {
					await qR.query(`SET TIME ZONE 'Asia/Jakarta'`)
					await qR.query('CREATE EXTENSION IF NOT EXISTS pg_trgm')
				}

				if (is_all) {
					await Promise.all(Object.values(Schemas).map(async enumss => {
						return qR.query(`CREATE SCHEMA IF NOT EXISTS ${enumss}`)
					}))
				}

				// Enable Fuzzy Search
				// TODO: Need superuser priviledge
				// await qR.query('CREATE EXTENSION IF NOT EXISTS pg_trgm')

				await qR.commitTransaction()
				await qR.release()
				await connection.destroy()
			} catch (e) {
				LoggerHelper.log(e)
				await qR.rollbackTransaction()
				await qR.release()
			}

			return createConnection({
				type: 'postgres',
				host: process.env.DB_HOST,
				port: parseInt(process.env.DB_PORT, 10),
				database: process.env.DB_NAME,
				username: process.env.DB_USER,
				password: process.env.DB_PASS,
				logging: Defaults.DEBUG,
				synchronize: process.env.SYNC === 'true',
				namingStrategy: NamingHelper,
				...is_all ? {
					entities: Object.keys(Records).map(key => EntityHelper.create(Records[key])),
				} : {},
			})
		}).then(async connection => {

			if (Defaults.DEBUG) {
				LoggerHelper.log('server', 'Connection has been established successfully!')
			}

			const qR = connection.createQueryRunner()
			await qR.connect()
			await qR.startTransaction()

			try {
				// ==================================================================
				// Disable CUD, only enable Read
				// ==================================================================

				if (is_all) {
					for (const comment of EntityHelper.getCommentQueries()) {
						LoggerHelper.log('server', 'Creating Comment Foreign Keys')
						await qR.query(comment)
					}
				}


				// ==================================================================
				// Run custom query
				// ==================================================================
				if (is_all) {
					for (const query of EntityHelper.runQueries()) {
						await qR.query(query)
					}
				}

				if (is_all) {
					for (const query of NamingHelper.foreignKeyNaming()) {
						await qR.query(query)
					}
				}

				if (is_all) {
					for (const query of ListenerHelper.createFunctionListener()) {
						await qR.query(query)
					}

					for (const query of ListenerHelper.createTriggerListener()) {
						for (const trigger of query) {
							await qR.query(trigger)
						}
					}
				}

				if (is_all || _command === 'trigger') {
					for (const query of await TriggerHelper.createTRIGGER(qR)) {
						for (const trigger of query) {
							for (const Q of trigger) {
							await qR.query(Q)
							}
						}
					}
				}

				if (is_all || _command === 'indexing') {
					for (const query of IndexingHelper.createIndexing()) {
						await qR.query(query)
					}
				}

				if (is_all || _command === 'procedure') {
					for (const query of ProcedureHelper.createProcedure()) {
						await qR.query(query)
					}
				}

				if (is_all || _command === 'seeder') {
					for (const query of SeederHelper.createSEEDER()) {
						for (const Q of query) {
							await qR.query(Q)
						}
					}
				}

				if (is_all) {
					for (const query of ViewHelper.createView()) {
						await qR.query(query)
					}
				}

				// ==================================================================
				// Create materialized view
				// ==================================================================

				if (is_all) {
					for (const query of EntityHelper.getMaterializedViewQueries()) {
						await qR.query(query)
					}
					for (const query of MviewHelper.createMaterializedView()) {
						await qR.query(query)
					}
					for (const query of MviewHelper.indexingMaterializedView()) {
						await qR.query(query)
					}
					for (const query of MviewHelper.createFunctionMaterializedView()) {
						await qR.query(query)
					}
					for (const query of MviewHelper.createTriggerMaterializedView()) {
						for (const trigger of query) {
							await qR.query(trigger)
						}
					}
				}

				// ==================================================================
				// Refresh materialized view
				// ==================================================================


				if (is_all) {
					for (const query of EntityHelper.refreshMaterializedView()) {
						await qR.query(query)
					}
					for (const query of MviewHelper.refreshMaterializedView()) {
						await qR.query(query)
					}
				}

				if (is_all || _command === 'setval') {
					await SetvalHelper.createSETVAL(qR)
				}

				await qR.commitTransaction()
				await qR.release()

				LoggerHelper.log()
				LoggerHelper.log('Success serve on DB ' + process.env.DB_HOST + ' .......')
				LoggerHelper.log()

				return connection
			} catch (e) {
				LoggerHelper.log(e)
				await qR.rollbackTransaction()
				await qR.release()
			}
		})
	},
}
