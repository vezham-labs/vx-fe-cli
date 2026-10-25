import jsonServer from 'json-server'
import path from 'path'
import { fileURLToPath } from 'url'

import { useLogger } from '@vezham/use-logger'

import { defineConfig as __defineConfig, defineData } from './config.ts'

const NAMESPACE = 'Mock/server'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration and data initialization
const config = __defineConfig()
const { db: data_db, routes: data_routes } = await defineData(config)

// Server setup
const server = jsonServer.create()
const router = jsonServer.router(data_db)
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, '../public'),
  logger: config.debug
})

// Constants for rate limiting
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 100 // 100 requests per minute

// URLs that should skip response formatting
const SKIP_FORMATTING_URLS = [
  '/heartbeat',
  '/ping',
  '/status',
  '/alive',
  '/ready',
  '/healthz',
  '/metrics',
  '/favicon.ico',
  // Add patterns with wildcards
  '/monitoring/*',
  '/system/*',
  // Add regex patterns (prefix with 'regex:')
  'regex:^/api/v\\d+/(heartbeat|ping|status)$'
]

// In-memory rate limiting store
const rateLimitStore = new Map<string, number[]>()

// Utility functions
const generateRequestId = (): string =>
  `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const getClientIp = (req: any): string =>
  req.ip ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  'unknown'

/**
 * Checks if a URL should skip response formatting
 * Supports exact matches, wildcard patterns, and regex patterns
 * @param url - The URL to check (case-insensitive)
 * @returns true if formatting should be skipped, false otherwise
 */
const shouldSkipFormatting = (url: string): boolean => {
  // Handle null/empty URLs
  if (!url || typeof url !== 'string') {
    return false
  }

  // Normalize URL - remove query parameters and make lowercase
  const normalizedUrl = url.split('?')[0].toLowerCase().trim()

  // Remove leading slash for consistent comparison
  const cleanUrl = normalizedUrl.startsWith('/')
    ? normalizedUrl.slice(1)
    : normalizedUrl

  return SKIP_FORMATTING_URLS.some(pattern => {
    try {
      // Handle regex patterns
      if (pattern.startsWith('regex:')) {
        const regexPattern = pattern.slice(6) // Remove 'regex:' prefix
        const regex = new RegExp(regexPattern, 'i') // Case-insensitive
        return regex.test(normalizedUrl)
      }

      // Normalize pattern
      const normalizedPattern = pattern.toLowerCase().trim()
      const cleanPattern = normalizedPattern.startsWith('/')
        ? normalizedPattern.slice(1)
        : normalizedPattern

      // Handle wildcard patterns
      if (cleanPattern.includes('*')) {
        const regexPattern = cleanPattern
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
          .replace(/\\\*/g, '.*') // Convert * to .*
        const wildcardRegex = new RegExp(`^${regexPattern}$`, 'i')
        return wildcardRegex.test(cleanUrl)
      }

      // Exact match
      return cleanUrl === cleanPattern
    } catch (error) {
      // Log error and continue with other patterns
      useLogger.warn(NAMESPACE, `Invalid URL pattern: ${pattern}`, error)
      return false
    }
  })
}

const getResourceType = (url: string, data: any, isError = false): string => {
  const pathParts = url.split('/').filter(part => part && part !== 'api')
  const resource = pathParts[0] || 'unknown'

  if (isError) {
    return Array.isArray(data) ? `error.${resource}.list` : `error.${resource}`
  }

  return Array.isArray(data) ? `${resource}.list` : resource
}

// Rate limiting function
const checkRateLimit = (req: any) => {
  const clientIp = getClientIp(req)
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW

  if (!rateLimitStore.has(clientIp)) {
    rateLimitStore.set(clientIp, [])
  }

  const requests = rateLimitStore.get(clientIp)!

  // Clean old requests
  const validRequests = requests.filter(timestamp => timestamp > windowStart)
  rateLimitStore.set(clientIp, validRequests)

  // Check limit
  if (validRequests.length >= RATE_LIMIT_MAX) {
    return {
      exceeded: true,
      remaining: 0,
      resetTime: new Date(windowStart + RATE_LIMIT_WINDOW).toISOString()
    }
  }

  // Add current request
  validRequests.push(now)
  rateLimitStore.set(clientIp, validRequests)

  return {
    exceeded: false,
    remaining: RATE_LIMIT_MAX - validRequests.length,
    resetTime: new Date(windowStart + RATE_LIMIT_WINDOW).toISOString()
  }
}

// Response formatting function
const formatResponse = (
  data: any,
  req: any,
  statusCode = 200,
  isError = false
): any => {
  const requestId = generateRequestId()
  const timestamp = new Date().toISOString()
  const method = req.method.toLowerCase()
  const originalUrl = req.originalUrl || req.url
  const apiUrl = originalUrl.replace(/\?.*$/, '')

  // Rate limiting check
  const rateLimit = checkRateLimit(req)

  // Handle rate limit exceeded
  if (rateLimit.exceeded && !isError) {
    return formatResponse(
      { error: 'Rate limit exceeded', details: 'Too many requests' },
      req,
      429,
      true
    )
  }

  const resourceType = getResourceType(apiUrl, data, isError)
  const isCollection = Array.isArray(data) && !isError

  // eslint-disable-next-line
  type msg = {
    i18n_key: string
    message: string
  }
  // Generate appropriate message
  const getMessage = (): msg => {
    if (isError) {
      const errorMessages: Record<number | 'default', msg> = {
        default: { i18n_key: 'unknown_error', message: 'An error occurred' },
        400: { i18n_key: '', message: 'Invalid request data' },
        401: { i18n_key: '', message: 'Authentication required' },
        403: { i18n_key: '', message: 'Access forbidden' },
        404: { i18n_key: 'bad_request', message: 'Resource not found' }, // invalid url
        429: { i18n_key: '', message: 'Rate limit exceeded' },
        500: { i18n_key: '', message: 'Internal server error' }
      }
      return errorMessages[statusCode] || errorMessages.default
    }

    const successMessages: Record<string | 'default', msg> = {
      default: {
        i18n_key: 'operation_success',
        message: 'Operation completed successfully'
      },
      'get-collection': {
        i18n_key: '',
        message: 'Resources retrieved successfully'
      },
      get: { i18n_key: '', message: 'Resource retrieved successfully' },
      post: { i18n_key: '', message: 'Resource created successfully' },
      put: { i18n_key: '', message: 'Resource updated successfully' },
      patch: { i18n_key: '', message: 'Resource updated successfully' },
      delete: { i18n_key: '', message: 'Resource deleted successfully' }
    }

    const key = method === 'get' && isCollection ? 'get-collection' : method
    return successMessages[key] || successMessages.default
  }

  let msg = getMessage()

  const response: any = {
    data,
    meta: {
      type: resourceType,
      url: apiUrl,
      timestamp,
      request_id: requestId,
      version: 'v1',
      code: statusCode,
      status: statusCode >= 400 ? 'failed' : 'success',
      i18n_key: msg.i18n_key,
      message: msg.message,
      rate_limit: {
        remaining: rateLimit.remaining,
        reset_time: rateLimit.resetTime,
        limit: RATE_LIMIT_MAX,
        window: RATE_LIMIT_WINDOW / 1000
      }
    }
  }

  // Add pagination for collections
  if (isCollection && !isError) {
    const page = parseInt(req.query._page) || 1
    const limit = parseInt(req.query._limit) || 10
    const offset = (page - 1) * limit
    const totalItems = data.length
    const hasMore = offset + limit < totalItems
    const simulatedTotal = totalItems > 0 ? Math.max(totalItems, limit * 3) : 0

    response.pagination = {
      has_more: hasMore,
      total: simulatedTotal,
      total_pages: Math.ceil(simulatedTotal / limit),
      page, // current_page: page,
      per_page: limit, // offset,
      sync_time: timestamp,
      cursors: {
        first: page > 1 ? `cursor_page_1` : null,
        previous: page > 1 ? `cursor_page_${page - 1}` : null,
        next: hasMore ? `cursor_page_${page + 1}` : null,
        last: `cursor_page_${Math.ceil(simulatedTotal / limit)}`
      }
    }
  }

  return response
}

// CORS middleware
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.cors_origin)
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Request logging middleware
server.use((req, _, next) => {
  if (config.debug)
    useLogger.log(
      NAMESPACE,
      `${req.method} ${req.url} - IP: ${getClientIp(req)}`
    )
  next()
})

// Response formatting middleware
server.use((req, res, next) => {
  // Check if this URL should skip formatting
  const skipFormatting = shouldSkipFormatting(req.originalUrl || req.url)

  const originalSend = res.send
  const originalJson = res.json

  // Override send method
  res.send = function (data) {
    // Skip formatting for specified URLs
    if (skipFormatting) {
      return originalSend.call(this, data)
    }

    // Check if data is already formatted (has data and meta properties)
    if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
      // Already formatted, send as-is without further processing
      return originalSend.call(this, data)
    }

    if (res.get('Content-Type')?.includes('application/json') && data) {
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data
        const isError = res.statusCode >= 400
        const formattedResponse = formatResponse(
          parsedData,
          req,
          res.statusCode,
          isError
        )
        return originalSend.call(
          this,
          JSON.stringify(formattedResponse, null, 2)
        )
      } catch (e) {
        return originalSend.call(this, data)
      }
    }
    return originalSend.call(this, data)
  }

  // Override json method
  res.json = function (data) {
    // Skip formatting for specified URLs
    if (skipFormatting) {
      return originalJson.call(this, data)
    }

    // Skip formatting for heartbeat endpoint
    if (req.originalUrl === '/heartbeat' || req.url === '/heartbeat') {
      return originalJson.call(this, data)
    }

    // Check if data is already formatted (has data and meta properties)
    if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
      // Already formatted, send as-is without triggering send override
      return originalJson.call(this, data)
    }

    // Format the response and send directly without triggering send override
    const isError = res.statusCode >= 400
    const formattedResponse = formatResponse(data, req, res.statusCode, isError)

    // Set content type and send directly using originalSend to avoid recursion
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return originalSend.call(this, JSON.stringify(formattedResponse, null, 2))
  }

  next()
})

// Health check endpoints
server.get('/heartbeat', (_, res) => {
  res.json({ status: true })
})

server.get('/health', (_, res) => {
  const database: Record<string, number> = {}

  Object.keys(data_db).forEach(key => {
    const value = (data_db as any)[key]
    database[key] = Array.isArray(value) ? value.length : 1
  })

  res.json({
    status: true,
    timestamp: new Date().toISOString(),
    name: config.app_name,
    version: '1.0.0',
    routes: Object.keys(data_routes).length,
    database,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    rate_limiting: {
      active_clients: rateLimitStore.size,
      window_seconds: RATE_LIMIT_WINDOW / 1000,
      max_requests: RATE_LIMIT_MAX
    }
  })
})

server.get('/config', (_, res) => {
  res.json({
    status: true,
    timestamp: new Date().toISOString(),
    name: config.app_name,
    version: '0.0.1'
  })
})

// Catch-all for root
server.use('*', (req, res, next) => {
  if (req.originalUrl === '/') {
    return res.status(200).send('Welcome to Mock Server!...')
  }
  next()
})

// Error handling middleware
server.use((err: any, _: any, res: any, __: any) => {
  useLogger.error(NAMESPACE, 'Server error:', err)
  res.status(500).json({
    error: 'Internal server error',
    details: config.debug ? err.message : 'Something went wrong',
    error_code: 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString()
  })
})

// Apply middlewares and router
server.use(middlewares)
server.use('/api', router)

// Start server with enhanced error handling
export const defineConfig = () => {
  const serverUrl = `http://${config.hostname}:${config.port}`

  server
    .listen(config.port, config.hostname, () => {
      useLogger.log(NAMESPACE, `🚀 Mock server is running on ${serverUrl}`)
      useLogger.log(NAMESPACE, `🏥 Health check: ${serverUrl}/health`)
      useLogger.log(NAMESPACE, `📊 API endpoints available at ${serverUrl}/api`)
      useLogger.log(NAMESPACE, `🌐 CORS enabled for: ${config.cors_origin}`)

      if (config.debug) {
        useLogger.log(NAMESPACE, `🐛 Debug logging: enabled`)
      }

      useLogger.log(
        NAMESPACE,
        `🚦 Rate limiting: ${RATE_LIMIT_MAX} requests per ${RATE_LIMIT_WINDOW / 1000} seconds`
      )
      useLogger.log(
        NAMESPACE,
        `📋 Response format: Comprehensive data/meta structure with industry standards`
      )
      useLogger.log(
        NAMESPACE,
        `🛣️  Custom routes loaded: ${Object.keys(data_routes).length}`
      )
      useLogger.log(NAMESPACE, `🛣️  Routes location: @data/routes.json`)
      useLogger.log(NAMESPACE, `📁 Database location: @data/db.json`)
      useLogger.log(
        NAMESPACE,
        `📝 Resources: ${Object.keys(data_db).length} ${Object.keys(data_db).toString()}`
      )
    })
    .on('error', (error: any) => {
      const errorHandlers: Record<string, string> = {
        EADDRINUSE: `❌ Port ${config.port} is already in use. Please choose a different port or stop the conflicting service.`,
        EACCES: `❌ Permission denied to bind to ${config.hostname}:${config.port}. Try using a port number above 1024.`
      }

      const message =
        errorHandlers[error.code] ||
        `❌ Failed to start server: ${error.message}`
      useLogger.error(NAMESPACE, message)
      process.exit(1)
    })
}
