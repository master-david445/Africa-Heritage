"use client"

import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Flag, CheckCircle, XCircle, Loader2, MessageSquare, User, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
    getReports,
    updateReportStatus,
    type Report
} from "@/app/actions/admin-reports"

export function ReportsTable() {
    const [reports, setReports] = useState<Report[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all")
    const { toast } = useToast()

    const fetchReports = async () => {
        try {
            setLoading(true)
            const data = await getReports()
            setReports(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch reports",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    const handleStatusUpdate = async (id: string, status: Report["status"]) => {
        try {
            await updateReportStatus(id, status)
            toast({
                title: "Success",
                description: `Report marked as ${status}`,
            })
            // Optimistic update
            setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r))
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update report",
                variant: "destructive"
            })
        }
    }

    const filteredReports = reports.filter(r => {
        if (filter === "all") return true
        if (filter === "pending") return r.status === "pending" || r.status === "reviewed"
        if (filter === "resolved") return r.status === "resolved" || r.status === "dismissed"
        return true
    })

    const getIcon = (type: string) => {
        switch (type) {
            case "proverb": return <FileText className="h-4 w-4" />
            case "comment": return <MessageSquare className="h-4 w-4" />
            case "profile": return <User className="h-4 w-4" />
            default: return <Flag className="h-4 w-4" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending": return <Badge variant="destructive">Pending</Badge>
            case "reviewed": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Reviewed</Badge>
            case "resolved": return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Resolved</Badge>
            case "dismissed": return <Badge variant="outline" className="text-gray-600">Dismissed</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="font-medium">Content Reports</h3>
                <Select
                    value={filter}
                    onValueChange={(val: any) => setFilter(val)}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Reports</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Reporter</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                                        <span>Loading reports...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredReports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                    No reports found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2 capitalize">
                                            {getIcon(report.content_type)}
                                            {report.content_type}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <p className="truncate text-sm" title={report.content_preview}>
                                            {report.content_preview}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium">{report.reason}</span>
                                        {report.description && (
                                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{report.description}</p>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-600">{report.reporter_username}</span>
                                        <p className="text-xs text-gray-400">
                                            {new Date(report.created_at).toLocaleDateString()}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(report.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {report.status === "pending" && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                                                    onClick={() => handleStatusUpdate(report.id, "dismissed")}
                                                    title="Dismiss"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    onClick={() => handleStatusUpdate(report.id, "resolved")}
                                                    title="Resolve"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
