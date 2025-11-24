import type { Proverb } from "@/lib/types"

interface ProverbContentProps {
  proverb: Proverb
}

export default function ProverbContent({ proverb }: ProverbContentProps) {
  return (
    <article>
      {/* Proverb Text */}
      <blockquote className="font-serif text-lg text-card-foreground mb-2 italic">
        {proverb.proverb}
      </blockquote>

      {/* Meaning */}
      <p className="text-muted-foreground mb-4">{proverb.meaning}</p>

      {/* Context (if available) */}
      {proverb.context && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-200 dark:border-orange-700 p-3 mb-4">
          <p className="text-sm text-muted-foreground italic">{proverb.context}</p>
        </div>
      )}

      {/* Categories */}
      {proverb.categories && proverb.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {proverb.categories.map((category: string) => (
            <span
              key={category}
              className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded-full"
            >
              {category}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
