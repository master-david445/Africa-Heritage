"use client"

import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Lightbulb, Bug, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
    getAllFeedback,
    updateFeedbackStatus,
    type Feedback
} from "@/app/actions/feedback"

export function FeedbackManager() {
    const [feedback, setFeedback] = useState<Feedback[]>([])
    const [loading, setLoading] = useState(true)
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [newStatus, setNewStatus] = useState<string>("")
    const [newPriority, setNewPriority] = useState<string>("")
    const [adminNotes, setAdminNotes] = useState("")
    const { toast } = useToast()

    const fetchFeedback = async () => {
        try {
            setLoading(true)
            const filters: any = {}
            if (typeFilter !== "all") filters.type = typeFilter
            if (statusFilter !== "all") filters.status = statusFilter

            const data = await getAllFeedback(filters)
            setFeedback(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch feedback",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFeedback()
    }, [typeFilter, statusFilter])

    const handleOpenDialog = (item: Feedback) => {
        setSelectedFeedback(item)
        setNewStatus(item.status)
        setNewPriority(item.priority)
        setAdminNotes(item.admin_notes || "")
        setDialogOpen(true)
    }

    const handleUpdate = async () => {
        if (!selectedFeedback) return

        try {
            await updateFeedbackStatus(
                selectedFeedback.id,
                newStatus as any,
                newPriority as any,
                adminNotes
            )
            toast({
                title: "Updated",
                description: "Feedback has been updated"
            })
            setDialogOpen(false)
            fetchFeedback()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update feedback",
                variant: "destructive"
            })
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

    const getPriorityBadge = (priority: string) => {
        const colors: Record<string, string> = {
            low: "bg-gray-100 text-gray-800",
            medium: "bg-yellow-100 text-yellow-800",
            high: "bg-red-100 text-red-800"
        }
        return colors[priority] || colors.medium
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">User Feedback</h3>
                    <p className="text-sm text-gray-600">Manage feature requests and bug reports</p>
                </div>
                <div className="flex gap-3">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="feature_request">Feature Requests</SelectItem>
                            <SelectItem value="bug_report">Bug Reports</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="planned">Planned</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4">
                {feedback.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-gray-500">No feedback found</p>
                        </CardContent>
                    </Card>
                ) : (
                    feedback.map((item) => (
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
                                            Submitted by {item.username} on {new Date(item.created_at).toLocaleDateString()}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Badge className={getStatusBadge(item.status)}>
                                            {item.status.replace("_", " ")}
                                        </Badge>
                                        <Badge className={getPriorityBadge(item.priority)}>
                                            {item.priority}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-3">{item.description}</p>
                                {item.admin_notes && (
                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
                                        <p className="text-sm font-semibold text-blue-900 mb-1">Admin Notes:</p>
                                        <p className="text-sm text-blue-800">{item.admin_notes}</p>
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenDialog(item)}
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Update Status
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Update Feedback</DialogTitle>
                        <DialogDescription>
                            Update the status and add notes for this feedback
                        </DialogDescription>
                    </DialogHeader>
                    {selectedFeedback && (
                        <div className="space-y-4 py-4">
                            <div>
                                <h4 className="font-semibold mb-2">{selectedFeedback.title}</h4>
                                <p className="text-sm text-gray-600">{selectedFeedback.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Status</Label>
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                        <SelectTrigger className="mt-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="reviewing">Reviewing</SelectItem>
                                            <SelectItem value="planned">Planned</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Priority</Label>
                                    <Select value={newPriority} onValueChange={setNewPriority}>
                                        <SelectTrigger className="mt-2">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label>Admin Notes</Label>
                                <Textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add notes for the user..."
                                    className="mt-2 min-h-[100px]"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} className="bg-orange-600 hover:bg-orange-700">
                            Update
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
