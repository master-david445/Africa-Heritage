export class AppError extends Error {
    public code: string
    public statusCode: number
    public metadata?: Record<string, any>

    constructor(message: string, code: string = 'INTERNAL_ERROR', statusCode: number = 500, metadata?: Record<string, any>) {
        super(message)
        this.name = 'AppError'
        this.code = code
        this.statusCode = statusCode
        this.metadata = metadata
    }
}

export class ValidationError extends AppError {
    constructor(message: string, metadata?: Record<string, any>) {
        super(message, 'VALIDATION_ERROR', 400, metadata)
        this.name = 'ValidationError'
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Unauthorized', metadata?: Record<string, any>) {
        super(message, 'AUTHENTICATION_ERROR', 401, metadata)
        this.name = 'AuthenticationError'
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Forbidden', metadata?: Record<string, any>) {
        super(message, 'AUTHORIZATION_ERROR', 403, metadata)
        this.name = 'AuthorizationError'
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found', metadata?: Record<string, any>) {
        super(message, 'NOT_FOUND_ERROR', 404, metadata)
        this.name = 'NotFoundError'
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests', metadata?: Record<string, any>) {
        super(message, 'RATE_LIMIT_ERROR', 429, metadata)
        this.name = 'RateLimitError'
    }
}

export function isAppError(error: unknown): error is AppError {
    return error instanceof AppError
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    return 'An unexpected error occurred'
}
