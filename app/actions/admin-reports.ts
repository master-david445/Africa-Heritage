"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Report {
    id: string
    content_type: "proverb" | "comment" | "profile"
    content_id: string
    reporter_id: string
    reason: string
    description: string | null
    status: "pending" | "reviewed" | "resolved" | "dismissed"
    created_at: string
    reporter_username: string
    content_preview: string
}

export async function getReports() {
    const supabase = await createClient()

    const { data: reports, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching reports:", error)
        throw new Error("Failed to fetch reports")
    }

    // Fetch content details and reporter usernames for each report
    const enrichedReports = await Promise.all(reports.map(async (report) => {
        let contentPreview = "Content not found"
        let reporterUsername = "Unknown"

        try {
            // Fetch reporter username
            const { data: reporter } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", report.reporter_id)
                .single()

            if (reporter) reporterUsername = reporter.username

            // Fetch content preview
            if (report.content_type === "proverb") {
                const { data } = await supabase.from("proverbs").select("proverb").eq("id", report.content_id).single()
                if (data) contentPreview = data.proverb
            } else if (report.content_type === "comment") {
                const { data } = await supabase.from("comments").select("content").eq("id", report.content_id).single()
                if (data) contentPreview = data.content
            } else if (report.content_type === "profile") {
                const { data } = await supabase.from("profiles").select("username").eq("id", report.content_id).single()
                if (data) contentPreview = `User: ${data.username}`
            }
        } catch (e) {
            // Ignore error if content deleted
        }

        return {
            ...report,
            reporter_username: reporterUsername,
            content_preview: contentPreview
        }
    }))

    return enrichedReports as Report[]
}

export async function updateReportStatus(reportId: string, status: Report["status"], note?: string) {
    const supabase = await createClient()

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

    if (!profile?.is_admin) throw new Error("Unauthorized")

    const { error } = await supabase
        .from("reports")
        .update({
            status,
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString(),
            resolution_note: note
        })
        .eq("id", reportId)

    if (error) throw error
    revalidatePath("/admin")
}
