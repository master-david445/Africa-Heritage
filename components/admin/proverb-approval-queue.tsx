"use client"

import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { CheckCircle, XCircle, Clock, Loader2, Quote, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
    getPendingProverbs,
    approveProverb,
    rejectProverb,
    deleteProverb,
    type PendingProverb
} from "@/app/actions/admin-proverbs"

export function ProverbApprovalQueue() {
    const [proverbs, setProverbs] = useState<PendingProverb[]>([])
    const [loading, setLoading] = useState(true)
    const [rejectionReason, setRejectionReason] = useState("")
    const [selectedProverb, setSelectedProverb] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchProverbs = async () => {
        try {
            setLoading(true)
            const data = await getPendingProverbs()
            setProverbs(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch pending proverbs",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProverbs()
    }, [])

    const handleApprove = async (id: string) => {
        try {
            await approveProverb(id)
            toast({
                title: "Approved",
                description: "Proverb has been approved and is now public",
            })
            setProverbs(prev => prev.filter(p => p.id !== id))
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve proverb",
                variant: "destructive"
            })
        }
    }

    const handleReject = async () => {
        if (!selectedProverb || !rejectionReason) return

        try {
            await rejectProverb(selectedProverb, rejectionReason)
            toast({
                title: "Rejected",
                description: "Proverb has been rejected",
            })
            setProverbs(prev => prev.filter(p => p.id !== selectedProverb))
            setSelectedProverb(null)
            setRejectionReason("")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject proverb",
                variant: "destructive"
            })
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this proverb? This action cannot be undone.")) {
            return
        }

        try {
            await deleteProverb(id)
            toast({
                title: "Deleted",
                description: "Proverb has been permanently deleted",
            })
            setProverbs(prev => prev.filter(p => p.id !== id))
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete proverb",
                variant: "destructive"
            })
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        )
    }

    if (proverbs.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">All Caught Up!</h3>
                <p className="text-gray-500">No pending proverbs to review.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {proverbs.map((proverb) => (
                    <Card key={proverb.id} className="overflow-hidden">
                        <CardHeader className="bg-gray-50/50 pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                        <AvatarImage src={proverb.avatar_url || ""} />
                                        <AvatarFallback>{proverb.username[0]?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Submitted by {proverb.username}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(proverb.created_at).toLocaleDateString()} at {new Date(proverb.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    Pending Review
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-serif font-medium text-gray-900 mb-2 flex gap-2">
                                        <Quote className="h-5 w-5 text-orange-400 rotate-180" />
                                        {proverb.content}
                                    </h3>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="secondary">{proverb.origin}</Badge>
                                        <Badge variant="outline">{proverb.category}</Badge>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-md">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Meaning:</p>
                                    <p className="text-gray-600">{proverb.meaning}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50/50 flex justify-between gap-3 py-4">
                            <Button
                                variant="outline"
                                className="text-red-700 hover:text-red-800 hover:bg-red-50 border-red-300"
                                onClick={() => handleDelete(proverb.id)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                            <div className="flex gap-3">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                            onClick={() => setSelectedProverb(proverb.id)}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Reject Proverb</DialogTitle>
                                            <DialogDescription>
                                                Please provide a reason for rejecting this proverb. This will be sent to the user.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4">
                                            <Textarea
                                                placeholder="Reason for rejection (e.g. Duplicate, Inappropriate content, Incorrect translation...)"
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                className="min-h-[100px]"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setSelectedProverb(null)}>Cancel</Button>
                                            <Button
                                                variant="destructive"
                                                onClick={handleReject}
                                                disabled={!rejectionReason.trim()}
                                            >
                                                Reject Proverb
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleApprove(proverb.id)}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
