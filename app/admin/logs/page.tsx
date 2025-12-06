"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, RefreshCw, AlertCircle, Info, AlertTriangle } from "lucide-react"

interface Log {
    id: string
    level: 'info' | 'warn' | 'error' | 'debug'
    message: string
    metadata: Record<string, any>
    user_id: string | null
    path: string | null
    method: string | null
    status_code: number | null
    duration_ms: number | null
    ip_address: string | null
    user_agent: string | null
    created_at: string
}

interface LogsResponse {
    logs: Log[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<Log[]>([])
    const [loading, setLoading] = useState(true)
    const [level, setLevel] = useState<string>('all')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
    })

    const fetchLogs = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50',
            })

            if (level !== 'all') {
                params.append('level', level)
            }

            if (search) {
                params.append('search', search)
            }

            const response = await fetch(`/api/admin/logs?${params}`)

            if (!response.ok) {
                throw new Error('Failed to fetch logs')
            }

            const data: LogsResponse = await response.json()
            setLogs(data.logs)
            setPagination(data.pagination)
        } catch (error) {
            console.error('Error fetching logs:', error)
        } finally {
            setLoading(false)
        }
    }, [level, page, search])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    const handleSearch = () => {
        setPage(1)
        fetchLogs()
    }

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'error':
                return <AlertCircle className="h-4 w-4" />
            case 'warn':
                return <AlertTriangle className="h-4 w-4" />
            case 'info':
                return <Info className="h-4 w-4" />
            default:
                return <Info className="h-4 w-4" />
        }
    }

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'error':
                return 'destructive'
            case 'warn':
                return 'warning'
            case 'info':
                return 'default'
            default:
                return 'secondary'
        }
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Application Logs</h1>
                <p className="text-muted-foreground">Monitor and debug application events</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Filter and search through application logs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search logs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Select value={level} onValueChange={setLevel}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Log level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="info">Info</SelectItem>
                                <SelectItem value="warn">Warning</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                                <SelectItem value="debug">Debug</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSearch} variant="outline">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                        <Button onClick={fetchLogs} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Logs ({pagination.total})</CardTitle>
                    <CardDescription>
                        Page {pagination.page} of {pagination.totalPages}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Loading logs...</div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No logs found</div>
                    ) : (
                        <div className="space-y-2">
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="mt-1">
                                                {getLevelIcon(log.level)}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={getLevelColor(log.level) as any}>
                                                        {log.level.toUpperCase()}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="font-medium">{log.message}</p>
                                                {log.path && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {log.method} {log.path}
                                                        {log.status_code && ` - ${log.status_code}`}
                                                        {log.duration_ms && ` (${log.duration_ms}ms)`}
                                                    </p>
                                                )}
                                                {Object.keys(log.metadata || {}).length > 0 && (
                                                    <details className="text-sm">
                                                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                                            View metadata
                                                        </summary>
                                                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                                                            {JSON.stringify(log.metadata, null, 2)}
                                                        </pre>
                                                    </details>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <Button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                variant="outline"
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-4">
                                Page {page} of {pagination.totalPages}
                            </span>
                            <Button
                                onClick={() => setPage(page + 1)}
                                disabled={page === pagination.totalPages}
                                variant="outline"
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
