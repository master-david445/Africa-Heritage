import type { Proverb } from "@/lib/types"

interface ProverbContentProps {
  proverb: Proverb
}

export default function ProverbContent({ proverb }: ProverbContentProps) {
  return (
    <article>
      {/* Proverb Text */}
      <blockquote className="font-serif text-lg text-gray-800 mb-2 italic">
        "{proverb.proverb}"
      </blockquote>

      {/* Meaning */}
      <p className="text-gray-600 mb-4">{proverb.meaning}</p>

      {/* Context (if available) */}
      {proverb.context && (
        <div className="bg-orange-50 border-l-4 border-orange-200 p-3 mb-4">
          <p className="text-sm text-gray-700 italic">{proverb.context}</p>
        </div>
      )}

      {/* Categories */}
      {proverb.categories && proverb.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {proverb.categories.map((category: string) => (
            <span
              key={category}
              className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}