"use client";

import { useEffect, useState } from 'react';

export default function Loading() {
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    // Show retry option after 10 seconds
    const timer = setTimeout(() => {
      setShowRetry(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-4">
      <div className="relative">
        <div className="h-16 w-16 animate-pulse rounded-full bg-orange-100">
          <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      </div>
      <p className="mt-4 text-gray-600">Loading content...</p>
      {showRetry && (
        <button
          onClick={handleRetry}
          className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Taking too long? Tap to retry
        </button>
      )}
      <p className="mt-2 text-xs text-gray-400">
        {typeof window !== 'undefined' ? `Viewport: ${window.innerWidth}x${window.innerHeight}` : ''}
      </p>
    </div>
  );
}