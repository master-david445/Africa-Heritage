import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProverbOfTheDay from "@/components/proverb-of-the-day"
import CategoryCards from "@/components/category-cards"

export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 space-y-8 sm:space-y-12">
      {/* Proverb of the Day Section */}
      <section className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Proverb of the Day</h1>
        <ProverbOfTheDay />
      </section>

      {/* Categories Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Explore Categories</h2>
          <Button asChild variant="link">
            <Link href="/explore" className="text-primary">
              View All
            </Link>
          </Button>
        </div>
        <CategoryCards />
      </section>

      {/* Call to Action */}
      <section className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Discover More African Wisdom</h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          Explore our collection of African proverbs and share your own wisdom with the community.
        </p>
        <Button asChild size="lg">
          <Link href="/explore">
            Explore All Proverbs
          </Link>
        </Button>
      </section>
    </div>
  )
}
