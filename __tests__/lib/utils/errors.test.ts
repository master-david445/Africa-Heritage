import {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    RateLimitError,
    isAppError,
    getErrorMessage
} from '@/lib/utils/errors'

describe('Error Utilities', () => {
    describe('AppError', () => {
        it('should create an instance with correct properties', () => {
            const error = new AppError('Something went wrong', 'TEST_ERROR', 500, { foo: 'bar' })

            expect(error).toBeInstanceOf(Error)
            expect(error).toBeInstanceOf(AppError)
            expect(error.message).toBe('Something went wrong')
            expect(error.code).toBe('TEST_ERROR')
            expect(error.statusCode).toBe(500)
            expect(error.metadata).toEqual({ foo: 'bar' })
        })

        it('should use default values', () => {
            const error = new AppError('Default error')

            expect(error.code).toBe('INTERNAL_ERROR')
            expect(error.statusCode).toBe(500)
            expect(error.metadata).toBeUndefined()
        })
    })

    describe('Subclasses', () => {
        it('ValidationError should have correct defaults', () => {
            const error = new ValidationError('Invalid input')
            expect(error.code).toBe('VALIDATION_ERROR')
            expect(error.statusCode).toBe(400)
        })

        it('AuthenticationError should have correct defaults', () => {
            const error = new AuthenticationError()
            expect(error.message).toBe('Unauthorized')
            expect(error.code).toBe('AUTHENTICATION_ERROR')
            expect(error.statusCode).toBe(401)
        })

        it('AuthorizationError should have correct defaults', () => {
            const error = new AuthorizationError()
            expect(error.message).toBe('Forbidden')
            expect(error.code).toBe('AUTHORIZATION_ERROR')
            expect(error.statusCode).toBe(403)
        })

        it('NotFoundError should have correct defaults', () => {
            const error = new NotFoundError()
            expect(error.message).toBe('Resource not found')
            expect(error.code).toBe('NOT_FOUND_ERROR')
            expect(error.statusCode).toBe(404)
        })

        it('RateLimitError should have correct defaults', () => {
            const error = new RateLimitError()
            expect(error.message).toBe('Too many requests')
            expect(error.code).toBe('RATE_LIMIT_ERROR')
            expect(error.statusCode).toBe(429)
        })
    })

    describe('isAppError', () => {
        it('should return true for AppError instances', () => {
            expect(isAppError(new AppError('test'))).toBe(true)
            expect(isAppError(new ValidationError('test'))).toBe(true)
        })

        it('should return false for standard Error', () => {
            expect(isAppError(new Error('test'))).toBe(false)
        })

        it('should return false for non-error objects', () => {
            expect(isAppError({ message: 'test' })).toBe(false)
            expect(isAppError('test')).toBe(false)
            expect(isAppError(null)).toBe(false)
        })
    })

    describe('getErrorMessage', () => {
        it('should return message from Error object', () => {
            expect(getErrorMessage(new Error('test message'))).toBe('test message')
        })

        it('should return string as is', () => {
            expect(getErrorMessage('test string')).toBe('test string')
        })

        it('should return default message for unknown types', () => {
            expect(getErrorMessage(123)).toBe('An unexpected error occurred')
            expect(getErrorMessage(null)).toBe('An unexpected error occurred')
        })
    })
})
