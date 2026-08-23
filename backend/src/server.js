import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { securityHeaders } from './middleware/securityHeaders.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { successResponse, errorResponse } from './utils/responseFormatter.js';
import apiRouter from './routes/index.js';

const app = express();

// 1. CORS Configuration with Origin White-list Verification
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (config.corsOrigins.includes('*') || config.corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin '${origin}' is not allowed by policy.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'X-Request-ID']
}));

// 2. Security Headers & Rate Limiting Middlewares
app.use(securityHeaders);
app.use(generalLimiter);

// 3. Body Parsers (Max 2MB payload size limit)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(requestLogger);

// 4. Health Check Endpoint (Process Status)
app.get('/health', (req, res) => {
  return successResponse(res, {
    service: 'NER-SmartRoute AI Node.js Backend API',
    status: 'ONLINE',
    environment: config.env,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  }, 'Service Health Operational');
});

// 5. Readiness Check Endpoint (Dependencies Verification)
app.get('/ready', async (req, res) => {
  let aiStatus = 'unreachable';

  try {
    const aiRes = await fetch(`${config.aiServiceUrl}/api/v1/health`, { signal: AbortSignal.timeout(2000) });
    if (aiRes.ok) {
      aiStatus = 'healthy';
    }
  } catch (err) {
    aiStatus = 'unreachable';
  }

  const isReady = aiStatus === 'healthy';

  const readinessData = {
    service: 'NER-SmartRoute AI API',
    isReady,
    dependencies: {
      expressServer: 'healthy',
      aiService: aiStatus,
      database: 'healthy_mock'
    },
    timestamp: new Date().toISOString()
  };

  if (isReady) {
    return successResponse(res, readinessData, 'All system dependencies ready for operational traffic');
  } else {
    return res.status(503).json({
      success: false,
      statusCode: 503,
      message: 'System dependencies not fully ready',
      data: readinessData,
      timestamp: new Date().toISOString()
    });
  }
});

// 6. REST API Router Mounting
app.use('/api/v1', apiRouter);

// 7. 404 Catch-All JSON Route Handler
app.use((req, res) => {
  return errorResponse(res, `Route '${req.originalUrl}' not found.`, { code: 'NOT_FOUND' }, 404);
});

// 8. Centralized Error Handling Middleware
app.use(errorHandler);

// 9. Start Server
app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`🚀 NER-SmartRoute AI Hardened Backend Running on Port ${config.port}`);
  console.log(`🌐 Environment: ${config.env}`);
  console.log(`🔒 Allowed Origins: ${config.corsOrigins.join(', ')}`);
  console.log(`====================================================`);
});

export default app;
