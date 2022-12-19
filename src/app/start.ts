import {
	config,
} from 'dotenv'
import 'reflect-metadata'

config()

import Defaults from '../utils/constants/default'

Defaults.setDebugLevel(process.env.DEBUG === 'true')


import Database from './database'

Database
	.init(process.argv.filter((i, n) => n > 1))
	.catch(console.warn)
