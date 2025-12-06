import React from "react"
import Link from "next/link"
import { Twitter, Instagram, Facebook, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-black border-t border-gray-800 dark:border-gray-900 pt-20 pb-10 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Column 1: Brand */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            K
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white leading-none">Koroba</h3>
                            <p className="text-xs text-orange-400 font-medium">Korobasayings</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Preserving African wisdom for future generations.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-orange-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-orange-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-orange-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                            <Facebook className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Column 2: Explore */}
                <div>
                    <h4 className="text-white font-bold mb-6">Explore</h4>
                    <ul className="space-y-4">
                        <li>
                            <Link href="/explore" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                Browse Proverbs
                            </Link>
                        </li>
                        <li>
                            <Link href="/categories" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                Categories
                            </Link>
                        </li>
                        <li>
                            <Link href="/leaderboard" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                Leaderboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/search" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                Search
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Community */}
                <div>
                    <h4 className="text-white font-bold mb-6">Community</h4>
                    <ul className="space-y-4">
                        <li>
                            <Link href="/share" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                Share Proverb
                            </Link>
                        </li>
                        <li>
                            <Link href="/contributors" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                Contributors
                            </Link>
                        </li>
                        <li>
                            <Link href="/guidelines" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                Guidelines
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                Blog
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Company */}
                <div>
                    <h4 className="text-white font-bold mb-6">Company</h4>
                    <ul className="space-y-4">
                        <li>
                            <Link href="/about" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link href="/privacy" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link href="/terms" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                                Terms of Service
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-sm text-center md:text-left">
                    © 2024 Koroba. All rights reserved. Built with ❤️ for Africa.
                </p>
                <a href="mailto:hello@koroba.com" className="flex items-center gap-2 text-gray-500 hover:text-orange-400 transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">hello@koroba.com</span>
                </a>
            </div>
        </footer>
    )
}
