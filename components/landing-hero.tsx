"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function LandingHero() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    })

    const heroElement = document.getElementById('landing-hero')
    if (heroElement) {
      observer.observe(heroElement)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  const scrollToContent = () => {
    const contentElement = document.getElementById('main-content')
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="landing-hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      role="banner"
      aria-labelledby="hero-heading"
    >
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-element"
        style={{
          backgroundImage: "url('/placeholder.jpg')", // Placeholder - replace with actual African landscape
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
        aria-hidden="true"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />

      {/* Cultural Pattern Overlay */}
      <div className="absolute inset-0 pattern-adinkra opacity-20" />

      {/* Heritage Gradient Overlay */}
      <div className="absolute inset-0 gradient-heritage opacity-30" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gold-accent/10 rounded-full blur-xl animate-pulse-glow"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-terracotta-orange/10 rounded-full blur-lg animate-pulse-glow"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-warm-brown/10 rounded-full blur-md animate-pulse-glow"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link href="/" className="inline-flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center font-bold text-terracotta-orange shadow-lg">
              AH
            </div>
            <span className="font-serif text-2xl font-bold text-white hidden sm:inline text-shadow-heritage">
              African Heritage
            </span>
          </Link>
        </div>

        {/* Main Headline */}
        <h1
          id="hero-heading"
          className={`text-display-1 text-white mb-6 text-shadow-heritage transition-all duration-1000 delay-200 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
          }`}
        >
          Discover the Wisdom of Africa
        </h1>

        {/* Subheadline */}
        <p
          className={`text-display-2 text-light-beige mb-12 max-w-3xl mx-auto text-shadow-heritage transition-all duration-1000 delay-400 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
          }`}
        >
          Ancient Proverbs, Modern Voices
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-600 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link href="/auth/sign-up">
            <Button
              size="lg"
              className="bg-gold-accent hover:bg-gold-accent/90 text-black font-semibold px-8 py-4 text-lg shadow-lg border-heritage group"
              aria-label="Join the African Heritage community"
            >
              <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Join Community
            </Button>
          </Link>

          <Link href="/explore">
            <Button
              variant="outline"
              size="lg"
              className="border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-black px-8 py-4 text-lg shadow-lg group"
              aria-label="Explore African proverbs"
            >
              <BookOpen className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Explore Proverbs
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-800 ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
        }`}
      >
        <button
          onClick={scrollToContent}
          className="text-white hover:text-gold-accent transition-colors duration-300 group"
          aria-label="Scroll to main content"
        >
          <ChevronDown className="w-8 h-8 animate-bounce group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Accessibility: Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gold-accent text-black px-4 py-2 rounded font-semibold z-50"
      >
        Skip to main content
      </a>
    </section>
  )
}