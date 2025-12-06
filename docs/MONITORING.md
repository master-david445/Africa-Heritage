# Monitoring & Observability Guide

This guide explains how to monitor and maintain the Africa-Heritage platform using the built-in monitoring tools.

## Health Check API

### Endpoint
`GET /api/health`

### Response
```json
{
  "status": "healthy",
  "timestamp": "2024-12-04T23:45:00.000Z",
  "services": {
    "database": {
      "status": "up",
      "responseTime": 45
    },
    "redis": {
      "status": "up",
      "responseTime": 12
    }
  },
  "uptime": 3600
}
```

### Status Codes
- `200`: All services healthy
- `503`: One or more services degraded or down

### Usage
Use this endpoint for:
- Uptime monitoring (e.g., UptimeRobot, Pingdom)
- Load balancer health checks
- CI/CD deployment verification

## Admin Dashboards

### Logs Dashboard
**URL**: `/admin/logs`

**Features**:
- View all application logs
- Filter by log level (info, warn, error, debug)
- Search logs by message content
- Pagination support
- View detailed metadata for each log entry

**Access**: Admin users only

### Health Dashboard
**URL**: `/admin/health`

**Features**:
- Real-time system status
- Service health monitoring (Database, Redis)
- Response time metrics
- Uptime tracking
- Auto-refresh every 30 seconds

**Access**: Admin users only

## Application Logging

### Using the Logger

```typescript
import { logger } from '@/lib/utils/logger'

// Info logs
logger.info('User logged in', { userId: user.id })

// Warning logs
logger.warn('Rate limit approaching', { 
  userId: user.id, 
  requestCount: 8 
})

// Error logs
logger.error('Database query failed', error, { 
  query: 'SELECT * FROM users' 
})

// Debug logs (development only)
logger.debug('Processing step', { step: 1, data: value })
```

### Log Levels

- **info**: General information about application flow
- **warn**: Warning conditions that should be reviewed
- **error**: Error conditions that need attention
- **debug**: Detailed debugging information (development only)

### Log Storage

Logs are stored in the `application_logs` table with:
- Automatic timestamp
- User ID (if authenticated)
- Request path and method
- Response status code
- Request duration
- IP address and user agent
- Custom metadata

### Log Retention

Configure log retention in your database:

```sql
-- Delete logs older than 30 days
DELETE FROM application_logs 
WHERE created_at < NOW() - INTERVAL '30 days';
```

Set up a cron job or scheduled task to run this regularly.

## Monitoring Best Practices

### 1. Set Up Alerts

Configure alerts for:
- Error rate > 5% in 5 minutes
- Health check failures
- Database response time > 500ms
- Redis connection failures

### 2. Regular Reviews

- Review error logs daily
- Check health dashboard weekly
- Analyze performance trends monthly

### 3. Performance Monitoring

Monitor these metrics:
- Database query times
- API response times
- Cache hit rates
- Error rates by endpoint

### 4. Security Monitoring

Watch for:
- Failed login attempts
- Rate limit violations
- Suspicious activity patterns
- Security audit log entries

## Troubleshooting

### High Error Rate

1. Check `/admin/logs` for recent errors
2. Filter by `error` level
3. Look for patterns in error messages
4. Check metadata for affected users/endpoints

### Slow Performance

1. Check `/admin/health` for service response times
2. Review database query logs
3. Check cache hit rates
4. Analyze slow query logs in Supabase

### Service Degradation

1. Visit `/api/health` to identify affected service
2. Check service-specific logs
3. Verify environment variables
4. Test service connectivity manually

## Integration with External Tools

### Uptime Monitoring

Add `/api/health` to your uptime monitoring service:
- **UptimeRobot**: Create HTTP monitor
- **Pingdom**: Add uptime check
- **StatusCake**: Configure website test

### Error Tracking

While we have built-in logging, you can integrate Sentry:

```bash
npm install @sentry/nextjs
```

Follow Sentry's Next.js setup guide.

### Performance Monitoring

Consider integrating:
- **Vercel Analytics**: Built-in for Vercel deployments
- **Google Analytics**: For user behavior tracking
- **New Relic**: For detailed APM

## CI/CD Integration

### GitHub Actions

The `.github/workflows/test.yml` workflow runs on every push:
- Linting
- Type checking
- Unit tests
- Build verification

### Pre-commit Hooks

Husky runs before each commit:
- Linting
- Type checking

This prevents committing code with errors.

## Maintenance Tasks

### Daily
- [ ] Review error logs
- [ ] Check health dashboard

### Weekly
- [ ] Analyze performance trends
- [ ] Review security audit logs
- [ ] Check for failed deployments

### Monthly
- [ ] Clean up old logs
- [ ] Review and update alerts
- [ ] Performance optimization review
- [ ] Security audit

## Support

For issues or questions:
1. Check the logs dashboard
2. Review this documentation
3. Check the health dashboard
4. Contact the development team
