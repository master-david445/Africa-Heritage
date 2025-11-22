'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Page Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
      <div className="mx-auto max-w-md space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900">
          Something went wrong!
        </h2>
        
        <p className="text-gray-600">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>

        <div className="flex flex-col space-y-3 pt-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Go to home
          </a>
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left">
          <h3 className="mb-2 text-sm font-medium text-gray-900">Error Details</h3>
          <details className="text-sm text-gray-600">
            <summary className="cursor-pointer select-none">View technical details</summary>
            <pre className="mt-2 overflow-auto rounded bg-white p-2 text-xs">
              {error.stack || 'No stack trace available'}
            </pre>
          </details>
        </div>
      </div>
    </div>
  )
}
