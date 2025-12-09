"use server"

import { createClient } from "@/lib/supabase/server"

export async function checkUsernameAvailability(username: string) {
    if (!username) return false

    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", username)
            .single()

        if (error && error.code === "PGRST116") {
            // No rows found - username is available
            return true
        }

        if (data) {
            // Username exists
            return false
        }

        // Default to unavailable if other error
        return false
    } catch (error) {
        console.error("Error checking username:", error)
        return false
    }
}
