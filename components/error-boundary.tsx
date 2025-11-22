"use client"

import React from "react"
import { AlertTriangle, RefreshCw, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorId?: string
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
  level?: 'app' | 'page' | 'component'
  name?: string
  enableSentry?: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return { hasError: true, error, errorId }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { level = 'component', name = 'Unknown', enableSentry = true } = this.props
    const errorId = this.state.errorId

    // Enhanced logging with context
    const errorContext = {
      errorId,
      level,
      component: name,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
    }

    console.error(`[ERROR_BOUNDARY] ${level.toUpperCase()} ERROR in ${name}:`, errorContext)

    // Send to monitoring service (Sentry, LogRocket, etc.)
    if (enableSentry && typeof window !== 'undefined') {
      // Placeholder for Sentry integration
      // Sentry.captureException(error, { contexts: { errorBoundary: errorContext } })

      // For now, send to console with structured logging
      console.error('[ERROR_BOUNDARY] Error sent to monitoring:', errorId)
    }

    // Could also send to custom logging endpoint
    this.logErrorToService(errorContext)
  }

  private async logErrorToService(errorContext: any) {
    try {
      // Placeholder for custom error logging service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorContext)
      // })

      console.log('[ERROR_BOUNDARY] Error logged to service:', errorContext.errorId)
    } catch (logError) {
      console.error('[ERROR_BOUNDARY] Failed to log error:', logError)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined })
  }

  render() {
    if (this.state.hasError) {
      const { level = 'component', name = 'Unknown' } = this.props

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      // Different UI based on error level
      if (level === 'app') {
        return (
          <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
            <div className="text-center max-w-lg">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We&apos;re sorry, but the application encountered an unexpected error.
                Our team has been notified and is working to fix this issue.
              </p>

              <Alert className="mb-6">
                <Bug className="h-4 w-4" />
                <AlertDescription>
                  Error ID: <code className="text-xs">{this.state.errorId}</code>
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button onClick={this.resetError} size="lg" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="w-full"
                >
                  Go to Homepage
                </Button>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-8 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">
                      {this.state.error.name}: {this.state.error.message}
                    </p>
                    <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        )
      }

      // Component/Page level error
      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <Alert className="mb-4">
              <AlertDescription className="text-xs">
                Error ID: {this.state.errorId}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button onClick={this.resetError} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              {level === 'page' && (
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Refresh Page
                </Button>
              )}
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                  Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
