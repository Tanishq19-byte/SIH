import { config } from '../config/env.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

/**
 * Express Proxy Controller for Python FastAPI AI Microservice
 */

export const predictDisruptionProxy = async (req, res, next) => {
  const targetUrl = `${config.aiServiceUrl}/api/v1/predict-disruption`;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[Express Proxy] AI prediction service returned status ${response.status}: ${errText}`);
      return errorResponse(res, 'AI prediction service returned an error status', null, response.status);
    }

    const aiData = await response.json();
    const durationMs = Date.now() - startTime;

    console.log(
      `[AI Proxy Log] routeId=${aiData.prediction?.routeId || 'NH-27'} | ` +
      `scenario=${req.body.scenario || 'CUSTOM'} | ` +
      `riskScore=${aiData.prediction?.riskScore} | ` +
      `riskLevel=${aiData.prediction?.riskLevel} | ` +
      `recommendation=${aiData.prediction?.recommendation} | ` +
      `latency=${durationMs}ms`
    );

    return successResponse(res, aiData, 'AI disruption prediction generated successfully via FastAPI ML model');
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('[Express Proxy] AI prediction service request timed out (5s limit)');
      return errorResponse(res, 'AI prediction service request timed out (5s limit)', null, 504);
    }

    // Return 503 Service Unavailable without exposing Python stack traces
    console.error('[Express Proxy] AI prediction service unavailable:', err.message);
    return errorResponse(res, 'AI prediction service unavailable', null, 503);
  }
};

export const getScenariosProxy = async (req, res, next) => {
  const targetUrl = `${config.aiServiceUrl}/api/v1/scenarios`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return successResponse(res, data, 'Demonstration scenarios fetched successfully');
    }

    return errorResponse(res, 'Failed to fetch AI demonstration scenarios', null, 502);
  } catch (err) {
    return errorResponse(res, 'AI scenario engine service unavailable', null, 503);
  }
};

export const getAIHealthProxy = async (req, res, next) => {
  const targetUrl = `${config.aiServiceUrl}/api/v1/health`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const response = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return successResponse(res, {
        aiService: 'healthy',
        modelLoaded: data.modelLoaded || true,
        version: data.version || 'v1.2.0',
        supportedScenarios: data.supportedScenarios || []
      }, 'AI Service Status Operational');
    }

    return errorResponse(res, 'AI prediction service unhealthy', { aiService: 'unhealthy' }, 503);
  } catch (err) {
    return errorResponse(res, 'AI prediction service unavailable', { aiService: 'unavailable' }, 503);
  }
};
