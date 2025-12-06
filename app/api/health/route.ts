import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Redis } from '@upstash/redis'

export const dynamic = 'force-dynamic'

interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy'
    timestamp: string
    services: {
        database: {
            status: 'up' | 'down'
            responseTime?: number
            error?: string
        }
        redis: {
            status: 'up' | 'down'
            responseTime?: number
            error?: string
        }
    }
    uptime: number
}

export async function GET() {
    const startTime = Date.now()
    const healthStatus: HealthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            database: { status: 'down' },
            redis: { status: 'down' },
        },
        uptime: process.uptime(),
    }

    // Check Database (Supabase)
    try {
        const dbStart = Date.now()
        const supabase = await createClient()
        const { error } = await supabase.from('profiles').select('id').limit(1)

        if (error) {
            healthStatus.services.database = {
                status: 'down',
                error: error.message,
            }
            healthStatus.status = 'degraded'
        } else {
            healthStatus.services.database = {
                status: 'up',
                responseTime: Date.now() - dbStart,
            }
        }
    } catch (error) {
        healthStatus.services.database = {
            status: 'down',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
        healthStatus.status = 'unhealthy'
    }

    // Check Redis (Upstash)
    try {
        const redisStart = Date.now()
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })

        await redis.ping()

        healthStatus.services.redis = {
            status: 'up',
            responseTime: Date.now() - redisStart,
        }
    } catch (error) {
        healthStatus.services.redis = {
            status: 'down',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
        healthStatus.status = 'degraded'
    }

    // Determine overall status
    const allServicesUp =
        healthStatus.services.database.status === 'up' &&
        healthStatus.services.redis.status === 'up'

    if (!allServicesUp && healthStatus.status === 'healthy') {
        healthStatus.status = 'degraded'
    }

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503

    return NextResponse.json(healthStatus, {
        status: statusCode,
        headers: {
            'Cache-Control': 'no-store, max-age=0',
        },
    })
}
