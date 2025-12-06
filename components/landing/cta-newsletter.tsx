import React from "react"
import { TrendingUp } from "lucide-react"
import Link from "next/link"

export function CtaNewsletter() {
    return (
        <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-black">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: CTA Text */}
                <div className="text-center lg:text-left animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        Join the Wisdom Revolution
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                        Be part of a movement preserving African heritage. Share your wisdom, discover new perspectives, and connect with your roots.
                    </p>
                    <Link href="/auth/sign-up">
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-300">
                            Get Started Now
                        </button>
                    </Link>
                </div>

                {/* Right Column: Newsletter Box */}
                <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/20 animate-slide-up hover:bg-white/15 transition-colors duration-300">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-orange-500/20 p-3 rounded-full">
                            <TrendingUp className="w-8 h-8 text-orange-400 animate-bounce-slow" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Weekly Wisdom Newsletter</h3>
                    </div>

                    <p className="text-gray-300 mb-8">
                        Get hand-picked proverbs, cultural insights, and community stories delivered to your inbox every week.
                    </p>

                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                disabled
                                className="w-full bg-white/20 border border-white/30 text-white placeholder-gray-400 rounded-full px-6 py-3 opacity-50 cursor-not-allowed focus:outline-none"
                            />
                        </div>
                        <button
                            disabled
                            className="w-full bg-orange-600/50 text-white px-8 py-3 rounded-full opacity-50 cursor-not-allowed font-medium"
                        >
                            Coming Soon
                        </button>
                        <p className="text-center text-orange-300 text-sm animate-pulse mt-4">
                            📬 Newsletter launching soon! Stay tuned.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
