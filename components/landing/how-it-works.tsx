import React from "react"
import { BookOpen, Heart, Users } from "lucide-react"

export function HowItWorks() {
    return (
        <section className="py-20 px-6 bg-gradient-to-br from-green-900/20 via-orange-900/20 to-pink-900/20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Preserving wisdom, one proverb at a time
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Discover Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-800 text-center animate-slide-up group hover:scale-105 hover:-translate-y-2 hover:shadow-xl transition-all duration-500">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                            <BookOpen className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Discover</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Browse thousands of authentic African proverbs from across the continent, each carrying centuries of wisdom and cultural heritage.
                        </p>
                    </div>

                    {/* Share Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-800 text-center animate-slide-up-delay-1 group hover:scale-105 hover:-translate-y-2 hover:shadow-xl transition-all duration-500">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                            <Heart className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Share</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Contribute proverbs from your culture, language, or family traditions. Help preserve ancestral wisdom for future generations.
                        </p>
                    </div>

                    {/* Connect Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg dark:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-gray-800 text-center animate-slide-up-delay-2 group hover:scale-105 hover:-translate-y-2 hover:shadow-xl transition-all duration-500">
                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300">
                            <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Connect</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Join a global community of wisdom seekers, storytellers, and cultural ambassadors celebrating African heritage.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
