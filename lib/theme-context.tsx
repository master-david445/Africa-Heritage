"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
    theme: Theme
    toggleTheme: () => void
    setTheme: (theme: Theme) => void
    resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system")
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")
    const [mounted, setMounted] = useState(false)

    // Get actual theme (light or dark) from theme setting
    const getResolvedTheme = (themeValue: Theme): "light" | "dark" => {
        if (themeValue === "system") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        }
        return themeValue
    }

    // Apply theme to document
    const applyTheme = (newTheme: "light" | "dark") => {
        const root = document.documentElement
        if (newTheme === "dark") {
            root.classList.add("dark")
        } else {
            root.classList.remove("dark")
        }
        setResolvedTheme(newTheme)
    }

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        setMounted(true)
        const stored = localStorage.getItem("theme") as Theme | null

        if (stored) {
            setThemeState(stored)
            const resolved = getResolvedTheme(stored)
            applyTheme(resolved)
        } else {
            // Default to system preference
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
            setThemeState("system")
            applyTheme(systemTheme)
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handleChange = (e: MediaQueryListEvent) => {
            if (theme === "system") {
                applyTheme(e.matches ? "dark" : "light")
            }
        }
        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [theme])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem("theme", newTheme)
        const resolved = getResolvedTheme(newTheme)
        applyTheme(resolved)
    }

    const toggleTheme = () => {
        const newTheme = resolvedTheme === "light" ? "dark" : "light"
        setTheme(newTheme)
    }

    // Prevent flash of unstyled content
    // if (!mounted) {
    //     return <>{children}</>
    // }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
