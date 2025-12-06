"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    MoreHorizontal,
    Search,
    Shield,
    ShieldAlert,
    CheckCircle,
    Ban,
    UserCog,
    Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
    getAdminUsers,
    toggleUserAdmin,
    toggleUserVerification,
    toggleUserSuspension,
    type AdminUser,
    type UserFilters
} from "@/app/actions/admin-users"

export function UserManagementTable() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const { toast } = useToast()

    // Filters state
    const [filters, setFilters] = useState<UserFilters>({
        page: 1,
        limit: 10,
        sort: "newest",
        status: "all",
        search: ""
    })

    // Debounce search
    const [searchTerm, setSearchTerm] = useState("")
    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getAdminUsers(filters)
            setUsers(data.users)
            setTotalUsers(data.total)
            setTotalPages(data.totalPages)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch users",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }, [filters, toast])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleAction = async (action: string, userId: string, value: boolean) => {
        try {
            switch (action) {
                case "admin":
                    await toggleUserAdmin(userId, value)
                    break
                case "verify":
                    await toggleUserVerification(userId, value)
                    break
                case "suspend":
                    await toggleUserSuspension(userId, value)
                    break
            }

            toast({
                title: "Success",
                description: `User updated successfully`,
            })

            // Refresh list
            fetchUsers()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Select
                        value={filters.status}
                        onValueChange={(val: any) => setFilters(prev => ({ ...prev, status: val, page: 1 }))}
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="admin">Admins</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.sort}
                        onValueChange={(val: any) => setFilters(prev => ({ ...prev, sort: val, page: 1 }))}
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="points_high">Highest Points</SelectItem>
                            <SelectItem value="points_low">Lowest Points</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                                        <span>Loading users...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    No users found matching your filters
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatar_url || ""} />
                                                <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium flex items-center gap-1">
                                                    {user.username}
                                                    {user.is_verified && <CheckCircle className="h-3 w-3 text-blue-500" />}
                                                    {user.is_admin && <Shield className="h-3 w-3 text-orange-500" />}
                                                </span>
                                                <span className="text-xs text-gray-500">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {user.is_suspended && (
                                                <Badge variant="destructive" className="text-xs">Suspended</Badge>
                                            )}
                                            {user.is_admin && (
                                                <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">Admin</Badge>
                                            )}
                                            {user.is_verified && (
                                                <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">Verified</Badge>
                                            )}
                                            {!user.is_suspended && !user.is_admin && !user.is_verified && (
                                                <Badge variant="secondary" className="text-xs">Member</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-sm">{user.points.toLocaleString()}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
                                                    Copy ID
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleAction("verify", user.id, !user.is_verified)}>
                                                    {user.is_verified ? "Remove Verification" : "Verify User"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction("admin", user.id, !user.is_admin)}>
                                                    {user.is_admin ? "Remove Admin" : "Make Admin"}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className={user.is_suspended ? "text-green-600" : "text-red-600"}
                                                    onClick={() => handleAction("suspend", user.id, !user.is_suspended)}
                                                >
                                                    {user.is_suspended ? "Unsuspend User" : "Suspend User"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-gray-500">
                        Showing {((filters.page || 1) - 1) * (filters.limit || 10) + 1} to {Math.min((filters.page || 1) * (filters.limit || 10), totalUsers)} of {totalUsers} users
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                            disabled={(filters.page || 1) <= 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                            disabled={(filters.page || 1) >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
