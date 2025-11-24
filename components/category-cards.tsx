"use client"

import { useRouter } from "next/navigation"
import { Users, Lightbulb, Crown, Clock, TrendingUp, Heart } from "lucide-react"

const categories = [
  {
    name: "Unity",
    gradient: "from-blue-500 to-cyan-500",
    icon: Users,
    description: "Proverbs about togetherness and community"
  },
  {
    name: "Wisdom",
    gradient: "from-purple-500 to-pink-500",
    icon: Lightbulb,
    description: "Timeless wisdom and knowledge"
  },
  {
    name: "Leadership",
    gradient: "from-orange-500 to-red-500",
    icon: Crown,
    description: "Guidance for leaders and followers"
  },
  {
    name: "Time",
    gradient: "from-green-500 to-emerald-500",
    icon: Clock,
    description: "Lessons about time and patience"
  },
  {
    name: "Growth",
    gradient: "from-yellow-500 to-amber-500",
    icon: TrendingUp,
    description: "Personal and communal development"
  },
  {
    name: "Love",
    gradient: "from-rose-500 to-pink-500",
    icon: Heart,
    description: "Proverbs about love and relationships"
  }
]

export function CategoryCards() {
  const router = useRouter()

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/search?categories=${encodeURIComponent(categoryName)}`)
  }

  return (
    <section className="py-8" aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="sr-only">Explore Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`group relative bg-gradient-to-br ${category.gradient} dark:opacity-90 rounded-xl p-6 text-white shadow-lg dark:shadow-2xl dark:shadow-black/50 hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900`}
              aria-label={`Explore ${category.name} proverbs`}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-2 border-white rounded-full"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className="w-8 h-8 text-white/90" aria-hidden="true" />
                  <div className="text-white/60 group-hover:text-white/80 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 text-left">{category.name}</h3>
                <p className="text-white/80 text-sm text-left leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryCards