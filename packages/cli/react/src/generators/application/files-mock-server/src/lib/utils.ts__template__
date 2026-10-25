import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { useLogger } from '@vezham/use-logger'

const NAMESPACE = 'Mock/utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// @vx/NOTE: Validates and parses the port number from environment variable
export const parsePort = (
  value: string | undefined,
  default_value: number
): number => {
  if (!value) {
    return default_value
  }

  const port = parseInt(value, 10)
  if (isNaN(port)) {
    useLogger.warn(
      NAMESPACE,
      `⚠️  Invalid PORT value "${value}". Using default port ${default_value}`
    )
    return default_value
  }
  if (port < 1 || port > 65535) {
    useLogger.warn(
      NAMESPACE,
      `⚠️  PORT ${port} is out of valid range (1-65535). Using default port ${default_value}`
    )
    return default_value
  }
  return port
}

// @vx/NOTE: Validates hostname
export const validateHost = (
  value: string | undefined,
  default_value: string
): string => {
  if (!value || value.trim() === '') {
    return default_value
  }

  // Basic hostname validation
  const host = value.trim()
  if (host.length > 250) {
    useLogger.warn(
      NAMESPACE,
      `⚠️  HOST "${host}" is too long. Using default host ${default_value}`
    )
    return default_value
  }

  return host
}

export const loadDB = (database: any) => {
  // Write to data/db.json - updated path to go up one level from src
  const db_path = path.join(__dirname, '../..', 'data', 'db.json')
  fs.writeFileSync(db_path, JSON.stringify(database, null, 2))

  useLogger.log(NAMESPACE, '✅ Mock database generated successfully!')
  useLogger.log(NAMESPACE, `📁 Database saved to: ${db_path}`)
}
