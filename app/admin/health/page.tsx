"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Activity, Database, Zap } from "lucide-react"

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

export default function AdminHealthPage() {
    const [health, setHealth] = useState<HealthStatus | null>(null)
    const [loading, setLoading] = useState(true)
    const [lastChecked, setLastChecked] = useState<Date | null>(null)

    const fetchHealth = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/health')
            const data: HealthStatus = await response.json()
            setHealth(data)
            setLastChecked(new Date())
        } catch (error) {
            console.error('Error fetching health:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHealth()

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchHealth, 30000)
        return () => clearInterval(interval)
    }, [])

    const getStatusIcon = (status: 'up' | 'down' | 'healthy' | 'degraded' | 'unhealthy') => {
        if (status === 'up' || status === 'healthy') {
            return <CheckCircle className="h-5 w-5 text-green-500" />
        } else if (status === 'degraded') {
            return <AlertCircle className="h-5 w-5 text-yellow-500" />
        } else {
            return <XCircle className="h-5 w-5 text-red-500" />
        }
    }

    const getStatusBadge = (status: 'up' | 'down' | 'healthy' | 'degraded' | 'unhealthy') => {
        if (status === 'up' || status === 'healthy') {
            return <Badge className="bg-green-500">Operational</Badge>
        } else if (status === 'degraded') {
            return <Badge className="bg-yellow-500">Degraded</Badge>
        } else {
            return <Badge variant="destructive">Down</Badge>
        }
    }

    const formatUptime = (seconds: number) => {
        const days = Math.floor(seconds / 86400)
        const hours = Math.floor((seconds % 86400) / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`
        } else {
            return `${minutes}m`
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">System Health</h1>
                    <p className="text-muted-foreground">Monitor system status and performance</p>
                </div>
                <Button onClick={fetchHealth} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {health && (
                <>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {getStatusIcon(health.status)}
                                        Overall Status
                                    </CardTitle>
                                    <CardDescription>
                                        Last checked: {lastChecked?.toLocaleTimeString()}
                                    </CardDescription>
                                </div>
                                {getStatusBadge(health.status)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-3 p-4 border rounded-lg">
                                    <Activity className="h-8 w-8 text-blue-500" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Uptime</p>
                                        <p className="text-2xl font-bold">{formatUptime(health.uptime)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 border rounded-lg">
                                    <Database className="h-8 w-8 text-purple-500" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Database</p>
                                        <p className="text-2xl font-bold">
                                            {health.services.database.status === 'up' ? 'Connected' : 'Down'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 border rounded-lg">
                                    <Zap className="h-8 w-8 text-orange-500" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Redis</p>
                                        <p className="text-2xl font-bold">
                                            {health.services.redis.status === 'up' ? 'Connected' : 'Down'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Database className="h-5 w-5" />
                                        Database (Supabase)
                                    </CardTitle>
                                    {getStatusBadge(health.services.database.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="font-medium">
                                        {health.services.database.status === 'up' ? 'Operational' : 'Down'}
                                    </span>
                                </div>
                                {health.services.database.responseTime && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Response Time:</span>
                                        <span className="font-medium">{health.services.database.responseTime}ms</span>
                                    </div>
                                )}
                                {health.services.database.error && (
                                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                                        {health.services.database.error}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-5 w-5" />
                                        Redis (Upstash)
                                    </CardTitle>
                                    {getStatusBadge(health.services.redis.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="font-medium">
                                        {health.services.redis.status === 'up' ? 'Operational' : 'Down'}
                                    </span>
                                </div>
                                {health.services.redis.responseTime && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Response Time:</span>
                                        <span className="font-medium">{health.services.redis.responseTime}ms</span>
                                    </div>
                                )}
                                {health.services.redis.error && (
                                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                                        {health.services.redis.error}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}

            {loading && !health && (
                <div className="text-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading health status...</p>
                </div>
            )}
        </div>
    )
}
