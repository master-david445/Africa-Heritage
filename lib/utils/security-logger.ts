import { createClient } from '@/lib/supabase/server'

export interface SecurityEvent {
    user_id: string
    event_type: 'email_change_requested' | 'password_changed' | 'login_attempt' | 'failed_login' | 'account_locked'
    metadata?: Record<string, any>
    ip_address?: string
    user_agent?: string
}

export async function logSecurityEvent(event: SecurityEvent) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('security_audit_log')
        .insert({
            ...event,
            created_at: new Date().toISOString(),
        })

    if (error) {
        console.error('Failed to log security event:', error)
        // Don't throw - logging failure shouldn't break the operation
    }
}
