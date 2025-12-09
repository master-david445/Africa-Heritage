"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    toggleAnnouncementStatus,
    deleteAnnouncement,
    type Announcement
} from "@/app/actions/announcements"

export function AnnouncementManager() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        message: "",
        type: "info" as "info" | "feature" | "maintenance" | "warning",
        expires_at: ""
    })
    const { toast } = useToast()

    const fetchAnnouncements = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getAllAnnouncements()
            setAnnouncements(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch announcements",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }, [toast])

    useEffect(() => {
        fetchAnnouncements()
    }, [fetchAnnouncements])

    const handleSubmit = async () => {
        if (!formData.title || !formData.message) {
            toast({
                title: "Error",
                description: "Title and message are required",
                variant: "destructive"
            })
            return
        }

        try {
            if (editingId) {
                await updateAnnouncement(editingId, {
                    title: formData.title,
                    message: formData.message,
                    type: formData.type,
                    expires_at: formData.expires_at || null
                })
                toast({
                    title: "Updated",
                    description: "Announcement has been updated"
                })
            } else {
                await createAnnouncement({
                    title: formData.title,
                    message: formData.message,
                    type: formData.type,
                    expires_at: formData.expires_at || null
                })
                toast({
                    title: "Created",
                    description: "Announcement has been created"
                })
            }
            setDialogOpen(false)
            resetForm()
            fetchAnnouncements()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save announcement",
                variant: "destructive"
            })
        }
    }

    const handleEdit = (announcement: Announcement) => {
        setEditingId(announcement.id)
        setFormData({
            title: announcement.title,
            message: announcement.message,
            type: announcement.type,
            expires_at: announcement.expires_at ? new Date(announcement.expires_at).toISOString().slice(0, 16) : ""
        })
        setDialogOpen(true)
    }

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await toggleAnnouncementStatus(id, !currentStatus)
            toast({
                title: currentStatus ? "Deactivated" : "Activated",
                description: `Announcement has been ${currentStatus ? "deactivated" : "activated"}`
            })
            fetchAnnouncements()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive"
            })
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this announcement?")) return

        try {
            await deleteAnnouncement(id)
            toast({
                title: "Deleted",
                description: "Announcement has been deleted"
            })
            fetchAnnouncements()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete announcement",
                variant: "destructive"
            })
        }
    }

    const resetForm = () => {
        setFormData({
            title: "",
            message: "",
            type: "info",
            expires_at: ""
        })
        setEditingId(null)
    }

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case "feature": return "bg-blue-100 text-blue-800"
            case "maintenance": return "bg-yellow-100 text-yellow-800"
            case "warning": return "bg-red-100 text-red-800"
            default: return "bg-gray-100 text-gray-800"
        }
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
                    <h3 className="text-lg font-semibold">Platform Announcements</h3>
                    <p className="text-sm text-gray-600">Manage announcements shown to all users</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open)
                    if (!open) resetForm()
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                            <Plus className="h-4 w-4 mr-2" />
                            New Announcement
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit" : "Create"} Announcement</DialogTitle>
                            <DialogDescription>
                                {editingId ? "Update" : "Create a new"} platform-wide announcement
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="New Feature Released!"
                                />
                            </div>
                            <div>
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="We've added a new feature that allows..."
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div>
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="info">Info</SelectItem>
                                        <SelectItem value="feature">Feature</SelectItem>
                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                        <SelectItem value="warning">Warning</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="expires_at">Expires At (Optional)</Label>
                                <Input
                                    id="expires_at"
                                    type="datetime-local"
                                    value={formData.expires_at}
                                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
                                {editingId ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-gray-500">No announcements yet</p>
                        </CardContent>
                    </Card>
                ) : (
                    announcements.map((announcement) => (
                        <Card key={announcement.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                            <Badge className={getTypeBadgeColor(announcement.type)}>
                                                {announcement.type}
                                            </Badge>
                                            <Badge variant={announcement.is_active ? "default" : "secondary"}>
                                                {announcement.is_active ? "Active" : "Inactive"}
                                            </Badge>
                                        </div>
                                        <CardDescription>
                                            Created {new Date(announcement.created_at).toLocaleDateString()}
                                            {announcement.expires_at && (
                                                <> • Expires {new Date(announcement.expires_at).toLocaleDateString()}</>
                                            )}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleToggleStatus(announcement.id, announcement.is_active)}
                                        >
                                            {announcement.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(announcement)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(announcement.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{announcement.message}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
