import 'dotenv/config'

import { defineLogger, useLogger } from '@vezham/use-logger'

import { parsePort, validateHost } from './utils.ts'

const NAMESPACE = 'Mock/config'

interface Server {
  hostname: string
  port: number
  // vx-bot/NOTE: PRE_PORT
  app_id: string
  debug: boolean
  // vx-bot/NOTE: beta: boolean
  cors_origin: string
  data_routes: string
  data_db: string
}

// vx-bot/NOTE: Loads and validates server configuration from environment variables
const defineConfig = (): Server => {
  useLogger.log(NAMESPACE, '🔧 Loading server configuration...')

  const config: Server = {
    hostname: process.env.CI
      ? 'localhost'
      : validateHost(process.env.HOST_NAME, 'localhost'),
    port: parsePort(process.env.PORT, 3030), // vx-bot/NOTE: PRE_PORT
    app_id: process.env.V_APP_ID || 'vx-app-mock',
    debug: process.env.V_IS_DEBUG === 'true',
    cors_origin: process.env.V_CORS_ORIGIN || '*',
    data_routes: process.env.V_DATA_ROUTES || '../../data/routes.json',
    data_db: process.env.V_DATA_DB || '../../data/db.json'
  }

  // vx-bot/NOTE: Validate configuration
  try {
    validateConfig(config)
  } catch (error: any) {
    useLogger.error(
      NAMESPACE,
      '❌ Configuration validation failed:',
      error.message
    )
    process.exit(1)
  }

  defineLog(config)
  return config
}

// vx-bot/NOTE: Validates that the configuration is valid for server startup
const validateConfig = async (config: Server): Promise<void> => {
  if (!config.hostname) {
    throw new Error('Host configuration is required')
  }

  if (!config.port || config.port < 1 || config.port > 65535) {
    throw new Error(`Invalid port configuration: ${config.port}`)
  }
}

// vx-bot/NOTE: skipping __DEV__ to log based on __DEBUG__ in mock env
const defineLog = (config: Server) => {
  // vx-bot/NOTE: const __DEV__ = process.env.MODE === 'development'
  defineLogger({
    APP_NAME: config.app_id,
    __DEBUG__: config.debug,
    __DEV__: config.debug
  })

  // vx-bot/NOTE: Logging examples:
  // useLogger.log(NAMESPACE, '📋 Logging')
  // useLogger.info(NAMESPACE, '📋 Logging')
  // useLogger.debug(NAMESPACE, '📋 Logging')
  // useLogger.warn(NAMESPACE, '📋 Logging')
  // useLogger.error(NAMESPACE, '📋 Logging')

  // vx-bot/NOTE: Log configuration (excluding sensitive data)
  useLogger.log(NAMESPACE, '📋 Server Configuration:')
  useLogger.log(NAMESPACE, `   Host: ${config.hostname}`)
  useLogger.log(NAMESPACE, `   Port: ${config.port}`)
  useLogger.log(NAMESPACE, `   App ID: ${config.app_id}`)
  useLogger.log(NAMESPACE, `   Debug: ${config.debug}`)
  useLogger.log(NAMESPACE, `   CORS Origin: ${config.cors_origin}`)
  useLogger.log(NAMESPACE, `   @data/routes: ${config.data_routes}`)
  useLogger.log(NAMESPACE, `   @data/db: ${config.data_db}`)
  useLogger.log(NAMESPACE, '')
}

// vx-bot/NOTE: Load database data
const defineDB = async (config: Server) => {
  let data_db
  try {
    const dbModule = await import(config.data_db, {
      with: { type: 'json' }
    })
    data_db = dbModule.default
  } catch (error) {
    useLogger.warn(
      NAMESPACE,
      '⚠️  Could not load database file, using empty database'
    )
    data_db = {}
  }

  return data_db
}

// vx-bot/NOTE: Load routes configuration
const defineRoutes = async (config: Server) => {
  let data_routes
  try {
    const routesModule = await import(config.data_routes, {
      with: { type: 'json' }
    })
    data_routes = routesModule.default
  } catch (error) {
    useLogger.warn(
      NAMESPACE,
      '⚠️  Could not load routes file, using default routes'
    )
    data_routes = { '/api/*': '/$1' }
  }
  return data_routes
}

const defineData = async (config: Server) => ({
  db: await defineDB(config),
  routes: await defineRoutes(config)
})

export { defineConfig, defineData }
