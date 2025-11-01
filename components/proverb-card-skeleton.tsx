import { Skeleton } from "@/components/ui/skeleton"

export default function ProverbCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md border-l-4 border-orange-600 p-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Proverb Content Skeleton */}
      <div className="space-y-3 mb-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Categories Skeleton */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-14" />
      </div>

      {/* Social Actions Skeleton */}
      <div className="flex gap-4 text-gray-500 text-sm border-t pt-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  )
}