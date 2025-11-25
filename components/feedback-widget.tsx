"use client"

import { useState } from "react"
import { MessageSquare, X, Lightbulb, Bug, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { submitFeedback } from "@/app/actions/feedback"
import { useAuth } from "@/lib/auth-context"

export function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [type, setType] = useState<"feature_request" | "bug_report">("feature_request")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const { toast } = useToast()
    const { user } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast({
                title: "Error",
                description: "Please log in to submit feedback",
                variant: "destructive"
            })
            return
        }

        if (!title.trim() || !description.trim()) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive"
            })
            return
        }

        try {
            setSubmitting(true)
            await submitFeedback({ type, title, description })
            toast({
                title: "Submitted!",
                description: `Your ${type === "feature_request" ? "feature request" : "bug report"} has been submitted`
            })
            setTitle("")
            setDescription("")
            setIsOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit feedback",
                variant: "destructive"
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed left-0 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-4 rounded-r-lg shadow-lg transition-all duration-300 z-50 flex items-center gap-2 group"
                    aria-label="Open feedback form"
                >
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-300 overflow-hidden">
                        Feedback
                    </span>
                </button>
            )}

            {/* Feedback Panel */}
            {isOpen && (
                <div className="fixed left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-r-lg shadow-2xl z-50 w-96 max-h-[90vh] overflow-y-auto border-r border-gray-200 dark:border-gray-700">
                    <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-tr-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            <h3 className="font-semibold">Send Feedback</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1 rounded transition"
                            aria-label="Close feedback form"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <div>
                            <Label className="text-gray-900 dark:text-gray-100">Feedback Type</Label>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setType("feature_request")}
                                    className={`p-3 border-2 rounded-lg transition ${type === "feature_request"
                                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                        }`}
                                >
                                    <Lightbulb className={`h-5 w-5 mx-auto mb-1 ${type === "feature_request" ? "text-orange-600" : "text-gray-400"
                                        }`} />
                                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100">Feature</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType("bug_report")}
                                    className={`p-3 border-2 rounded-lg transition ${type === "bug_report"
                                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                        }`}
                                >
                                    <Bug className={`h-5 w-5 mx-auto mb-1 ${type === "bug_report" ? "text-red-600" : "text-gray-400"
                                        }`} />
                                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100">Bug</div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="widget-title" className="text-gray-900 dark:text-gray-100">Title</Label>
                            <Input
                                id="widget-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={
                                    type === "feature_request"
                                        ? "e.g., Add dark mode"
                                        : "e.g., Login not working"
                                }
                                className="mt-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                            />
                        </div>

                        <div>
                            <Label htmlFor="widget-description" className="text-gray-900 dark:text-gray-100">Description</Label>
                            <Textarea
                                id="widget-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={
                                    type === "feature_request"
                                        ? "Describe the feature..."
                                        : "Describe the bug..."
                                }
                                className="mt-1 min-h-[120px] dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-orange-600 hover:bg-orange-700"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Submit Feedback
                                </>
                            )}
                        </Button>

                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Your feedback helps us improve the platform
                        </p>
                    </form>
                </div>
            )}
        </>
    )
}
