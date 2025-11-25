"use client"

import { useState, useEffect } from "react"
import { X, Info, Megaphone, AlertTriangle, Wrench } from "lucide-react"
import { getActiveAnnouncements, type Announcement } from "@/app/actions/announcements"

export function AnnouncementBanner() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [dismissed, setDismissed] = useState<string[]>([])

    useEffect(() => {
        // Load dismissed announcements from localStorage
        const dismissedIds = localStorage.getItem("dismissedAnnouncements")
        if (dismissedIds) {
            setDismissed(JSON.parse(dismissedIds))
        }

        // Fetch active announcements initially
        const fetchAnnouncements = () => {
            getActiveAnnouncements().then(setAnnouncements)
        }

        fetchAnnouncements()

        // Poll for new announcements every 30 seconds
        const interval = setInterval(fetchAnnouncements, 30000)

        return () => clearInterval(interval)
    }, [])

    const handleDismiss = (id: string) => {
        const newDismissed = [...dismissed, id]
        setDismissed(newDismissed)
        localStorage.setItem("dismissedAnnouncements", JSON.stringify(newDismissed))
    }

    const visibleAnnouncements = announcements.filter(a => !dismissed.includes(a.id))

    if (visibleAnnouncements.length === 0) return null

    const getTypeStyles = (type: string) => {
        switch (type) {
            case "feature":
                return "bg-blue-50 border-blue-200 text-blue-900"
            case "maintenance":
                return "bg-yellow-50 border-yellow-200 text-yellow-900"
            case "warning":
                return "bg-red-50 border-red-200 text-red-900"
            default:
                return "bg-orange-50 border-orange-200 text-orange-900"
        }
    }

    const getIcon = (type: string) => {
        switch (type) {
            case "feature":
                return <Megaphone className="h-5 w-5" />
            case "maintenance":
                return <Wrench className="h-5 w-5" />
            case "warning":
                return <AlertTriangle className="h-5 w-5" />
            default:
                return <Info className="h-5 w-5" />
        }
    }

    return (
        <div className="space-y-2">
            {visibleAnnouncements.map((announcement) => (
                <div
                    key={announcement.id}
                    className={`border-l-4 p-4 ${getTypeStyles(announcement.type)} relative`}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            {getIcon(announcement.type)}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm">{announcement.title}</h3>
                            <p className="text-sm mt-1">{announcement.message}</p>
                        </div>
                        <button
                            onClick={() => handleDismiss(announcement.id)}
                            className="flex-shrink-0 hover:opacity-70 transition"
                            aria-label="Dismiss"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
