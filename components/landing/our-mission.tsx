import React from "react"

export function OurMission() {
    return (
        <section className="py-20 px-6 bg-gradient-to-br from-green-900/20 via-orange-900/20 to-pink-900/20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                        Our Mission
                    </h2>
                    <div className="w-24 h-1 bg-orange-600 dark:bg-orange-400 mx-auto rounded-full"></div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-2xl p-10 md:p-12 mb-16 animate-fade-in-delay hover:shadow-2xl transition-shadow duration-300">
                    <div className="space-y-6 text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                        <p>
                            African proverbs are more than words—they are the heartbeat of our cultures, carrying the wisdom of ancestors, the lessons of generations, and the soul of our communities.
                        </p>
                        <p>
                            Koroba exists to preserve, celebrate, and share this invaluable heritage. In a rapidly changing world, we believe these timeless teachings offer guidance, inspiration, and connection to our roots.
                        </p>
                        <p>
                            {"Whether you're rediscovering your culture, teaching the next generation, or simply seeking wisdom, Koroba is your digital library of African knowledge—a bridge between ancient wisdom and modern voices."}
                        </p>
                    </div>
                </div>

                {/* Value Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center animate-fade-in-up hover:scale-105 transition-transform duration-300 border border-gray-100 dark:border-gray-700">
                        <div className="text-4xl mb-3">🌍</div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Cultural Preservation</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Safeguarding heritage for future generations</p>
                    </div>

                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center animate-fade-in-up-delay-1 hover:scale-105 transition-transform duration-300 border border-gray-100 dark:border-gray-700">
                        <div className="text-4xl mb-3">🤝</div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Community Building</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Connecting Africans worldwide through wisdom</p>
                    </div>

                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center animate-fade-in-up-delay-2 hover:scale-105 transition-transform duration-300 border border-gray-100 dark:border-gray-700">
                        <div className="text-4xl mb-3">📚</div>
                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Education & Growth</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Learning from ancestral knowledge</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
