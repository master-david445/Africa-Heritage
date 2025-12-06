import { createClient } from "@/lib/supabase/client"

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
    level: LogLevel
    message: string
    metadata?: Record<string, any>
    error?: Error | unknown
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development'

    private async logToDatabase(entry: LogEntry) {
        try {
            // Don't log to DB in development unless it's an error
            if (this.isDevelopment && entry.level !== 'error') return

            // In a real app, you might want to batch these or use a beacon
            // For now, we'll just fire and forget
            const supabase = createClient()

            const { error } = await supabase.from('application_logs').insert({
                level: entry.level,
                message: entry.message,
                metadata: {
                    ...entry.metadata,
                    error: entry.error instanceof Error ? {
                        name: entry.error.name,
                        message: entry.error.message,
                        stack: entry.error.stack
                    } : entry.error
                },
                path: typeof window !== 'undefined' ? window.location.pathname : undefined,
                user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
            })

            if (error) {
                console.error('Failed to log to database:', error)
            }
        } catch (err) {
            console.error('Failed to log to database:', err)
        }
    }

    info(message: string, metadata?: Record<string, any>) {
        if (this.isDevelopment) {
            console.log(`[INFO] ${message}`, metadata || '')
        }
        this.logToDatabase({ level: 'info', message, metadata })
    }

    warn(message: string, metadata?: Record<string, any>) {
        if (this.isDevelopment) {
            console.warn(`[WARN] ${message}`, metadata || '')
        }
        this.logToDatabase({ level: 'warn', message, metadata })
    }

    error(message: string, error?: Error | unknown, metadata?: Record<string, any>) {
        if (this.isDevelopment) {
            console.error(`[ERROR] ${message}`, error || '', metadata || '')
        }
        this.logToDatabase({ level: 'error', message, error, metadata })
    }

    debug(message: string, metadata?: Record<string, any>) {
        if (this.isDevelopment) {
            console.debug(`[DEBUG] ${message}`, metadata || '')
        }
        // Debug logs usually don't go to DB
    }
}

export const logger = new Logger()
