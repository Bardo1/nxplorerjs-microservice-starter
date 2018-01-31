import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import IMetrics from '../interfaces/imetrics';

const Prometheus = require('prom-client');

const httpRequestDurationMicroseconds = new Prometheus.Summary({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route', 'statusCode'],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500]
});

@injectable()
class MetricsService implements IMetrics {
  logAPIMetrics(req: Request, res: Response, statusCode: number) {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const responseTime = res.getHeader('x-response-time');
    if (responseTime) {
      httpRequestDurationMicroseconds
        .labels(fullUrl, statusCode)
        .observe(Number(responseTime));
    } else {
      httpRequestDurationMicroseconds.labels(fullUrl, statusCode);
    }
  }
}

export default MetricsService;
