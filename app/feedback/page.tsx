"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Lightbulb, Bug, Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { submitFeedback, getUserFeedback, type Feedback } from "@/app/actions/feedback"
import Header from "@/components/header"

export default function FeedbackPage() {
    const [type, setType] = useState<"feature_request" | "bug_report">("feature_request")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [myFeedback, setMyFeedback] = useState<Feedback[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    const fetchMyFeedback = async () => {
        try {
            setLoading(true)
            const data = await getUserFeedback()
            setMyFeedback(data)
        } catch (error) {
            console.error("Error fetching feedback:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMyFeedback()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

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
            fetchMyFeedback()
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

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-gray-100 text-gray-800",
            reviewing: "bg-blue-100 text-blue-800",
            planned: "bg-purple-100 text-purple-800",
            in_progress: "bg-yellow-100 text-yellow-800",
            completed: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800"
        }
        return colors[status] || colors.pending
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Feedback & Support</h1>
                        <p className="text-gray-600">Help us improve by sharing your ideas or reporting issues</p>
                    </div>

                    <Tabs defaultValue="submit" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
                            <TabsTrigger value="my-feedback">My Submissions</TabsTrigger>
                        </TabsList>

                        <TabsContent value="submit">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Share Your Feedback</CardTitle>
                                    <CardDescription>
                                        Request a new feature or report a bug you&apos;ve encountered
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <Label>Feedback Type</Label>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setType("feature_request")}
                                                    className={`p-4 border-2 rounded-lg transition ${type === "feature_request"
                                                        ? "border-orange-500 bg-orange-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                >
                                                    <Lightbulb className={`h-6 w-6 mx-auto mb-2 ${type === "feature_request" ? "text-orange-600" : "text-gray-400"
                                                        }`} />
                                                    <div className="font-medium">Feature Request</div>
                                                    <div className="text-xs text-gray-500 mt-1">Suggest a new feature</div>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setType("bug_report")}
                                                    className={`p-4 border-2 rounded-lg transition ${type === "bug_report"
                                                        ? "border-red-500 bg-red-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                >
                                                    <Bug className={`h-6 w-6 mx-auto mb-2 ${type === "bug_report" ? "text-red-600" : "text-gray-400"
                                                        }`} />
                                                    <div className="font-medium">Bug Report</div>
                                                    <div className="text-xs text-gray-500 mt-1">Report an issue</div>
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder={
                                                    type === "feature_request"
                                                        ? "e.g., Add dark mode support"
                                                        : "e.g., Login button not working"
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder={
                                                    type === "feature_request"
                                                        ? "Describe the feature you'd like to see..."
                                                        : "Describe the bug and steps to reproduce it..."
                                                }
                                                className="mt-2 min-h-[150px]"
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
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="my-feedback">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                                </div>
                            ) : myFeedback.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <p className="text-gray-500">You haven&apos;t submitted any feedback yet</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {myFeedback.map((item) => (
                                        <Card key={item.id}>
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            {item.type === "feature_request" ? (
                                                                <Lightbulb className="h-5 w-5 text-orange-600" />
                                                            ) : (
                                                                <Bug className="h-5 w-5 text-red-600" />
                                                            )}
                                                            <CardTitle className="text-lg">{item.title}</CardTitle>
                                                        </div>
                                                        <CardDescription>
                                                            Submitted {new Date(item.created_at).toLocaleDateString()}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge className={getStatusBadge(item.status)}>
                                                        {item.status.replace("_", " ")}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-gray-700 mb-3">{item.description}</p>
                                                {item.admin_notes && (
                                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-3">
                                                        <p className="text-sm font-semibold text-blue-900 mb-1">Admin Response:</p>
                                                        <p className="text-sm text-blue-800">{item.admin_notes}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}
