"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Users, Flag, CheckCircle } from "lucide-react"
import { getPlatformStats, getReportedContent, type PlatformStats, type ReportedContent } from "@/app/actions/admin"

export default function AdminDashboard() {
  const { user, profile, isLoading, refreshProfile } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [reports, setReports] = useState<ReportedContent[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    // Debug logging
    console.log("[ADMIN] Loading state:", isLoading)
    console.log("[ADMIN] User:", user?.id)
    console.log("[ADMIN] Profile:", profile)
    console.log("[ADMIN] Is admin:", profile?.is_admin)

    // Wait for auth to load
    if (isLoading) return

    // Check admin status
    if (!user || !profile?.is_admin) {
      console.log("[ADMIN] Access denied - redirecting to home")
      router.push("/")
      return
    }

    // Fetch admin data only once
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true
      
      async function fetchAdminData() {
        try {
          setDataLoading(true)
          setError(null)
          const [statsData, reportsData] = await Promise.all([
            getPlatformStats(),
            getReportedContent()
          ])
          setStats(statsData)
          setReports(reportsData)
        } catch (err) {
          setError("Failed to load admin data")
          console.error("Error fetching admin data:", err)
        } finally {
          setDataLoading(false)
        }
      }

      fetchAdminData()
    }
  }, [user, profile, isLoading, router])

  // Debug: Show loading state or access denied
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-6">
        <div className="mobile-loading">
          <div className="text-center">
            <p className="text-lg mb-4">Loading admin dashboard...</p>
            <div className="mobile-loading-spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have admin privileges. Current status:
          </p>
          <div className="bg-white p-4 rounded-lg shadow text-left text-sm">
            <p><strong>User ID:</strong> {user?.id || 'None'}</p>
            <p><strong>Profile:</strong> {profile ? 'Loaded' : 'Not loaded'}</p>
            <p><strong>Is Admin:</strong> {profile?.is_admin ? 'Yes' : 'No'}</p>
            <p><strong>Username:</strong> {profile?.username || 'N/A'}</p>
          </div>
          <button
            onClick={refreshProfile}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Refresh Profile
          </button>
        </div>
      </div>
    )
  }

  const handleReportAction = (reportId: string, action: "approve" | "reject") => {
    setReports(
      reports.map((report) =>
        report.id === reportId ? { ...report, status: action === "approve" ? "resolved" : "reviewed" } : report,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const pendingReports = reports.filter((r) => r.status === "pending").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage platform content, users, and community guidelines</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {dataLoading ? (
            // Loading skeletons for stats cards
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-3">
              <Card className="border-red-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : stats ? (
            <>
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">Active community members</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Proverbs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalProverbs.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">Shared on platform</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.activeUsers}</div>
                  <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Reported Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.reportedContent}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="text-red-600 font-semibold">{pendingReports}</span> pending
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Suspended Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.suspendedUsers}</div>
                  <p className="text-xs text-gray-500 mt-1">Policy violations</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalComments.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">Community engagement</p>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>

        {/* Moderation Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Content Moderation</CardTitle>
            <CardDescription>Review and manage reported content</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="reports" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="reports">
                  Reports
                  {pendingReports > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {pendingReports}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
              </TabsList>

              <TabsContent value="reports" className="space-y-4 mt-4">
                {reports.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">No reports to review</p>
                  </div>
                ) : (
                  reports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Flag className="w-5 h-5 text-orange-500" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                            </p>
                            <p className="text-sm text-gray-600">Reported by {report.reportedBy}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      </div>

                      <div className="mb-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{report.content}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-gray-600">
                            <span className="font-semibold">Reason:</span> {report.reason}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(report.timestamp).toLocaleDateString()} {new Date(report.timestamp).toLocaleTimeString()}
                          </p>
                        </div>

                        {report.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReportAction(report.id, "reject")}
                              className="text-gray-600"
                            >
                              Review
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReportAction(report.id, "approve")}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              Resolve
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="users" className="space-y-4 mt-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">User Management</p>
                      <p className="text-sm text-gray-600">View and manage user accounts</p>
                    </div>
                    <Users className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Total registered users: {stats?.totalUsers || 0}</p>
                    <p>Active users (24h): {stats?.activeUsers || 0}</p>
                    <p>Suspended accounts: {stats?.suspendedUsers || 0}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="guidelines" className="space-y-4 mt-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">Community Guidelines</p>
                      <p className="text-sm text-gray-600">Platform policies and rules</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-orange-500" />
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Respect cultural and religious diversity</li>
                    <li>• No hate speech or discrimination</li>
                    <li>• No spam or promotional content</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• No harassment or bullying</li>
                    <li>• Keep discussions constructive and respectful</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
