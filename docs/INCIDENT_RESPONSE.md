# Security Incident Response Plan

## 1. Preparation
- **Team**: Designated security response team (Developers + Admins).
- **Tools**: Supabase Dashboard, Upstash Console, Sentry (planned), Vercel Logs.
- **Access**: Ensure team has access to logs and database backups.

## 2. Identification
**Triggers:**
- Automated alerts (e.g., high rate of failed logins).
- User reports of suspicious activity.
- Anomalies in audit logs.

**Verification:**
- Check `security_audit_log` for recent events.
- Check Vercel logs for traffic spikes or error patterns.
- Verify if it's a false positive.

## 3. Containment
**Immediate Actions:**
1.  **Block User/IP**: If a specific user or IP is attacking, block them via Supabase Auth or Vercel Firewall.
2.  **Revoke Sessions**: Use `supabase.auth.admin.signOut(userId)` to force logout suspicious users.
3.  **Rate Limiting**: Increase strictness of rate limits in `lib/utils/rate-limiter.ts` if needed.
4.  **Maintenance Mode**: If critical, enable maintenance mode to stop all writes.

## 4. Eradication
- **Patch Vulnerability**: Identify the code flaw and deploy a hotfix immediately.
- **Clean Data**: Remove any malicious data injected into the database.
- **Reset Credentials**: Force password resets for affected accounts.

## 5. Recovery
- **Restore Service**: Disable maintenance mode.
- **Monitor**: Watch logs closely for 24-48 hours to ensure the attack has stopped.
- **Verify**: Ensure all systems are functioning normally.

## 6. Lessons Learned (Post-Mortem)
- **Report**: Write a detailed incident report (Timeline, Root Cause, Impact, Resolution).
- **Improvement**: Update security measures and this plan based on findings.
- **Training**: Discuss the incident with the team to prevent recurrence.

## Contacts
- **Security Lead**: [Name/Email]
- **DevOps**: [Name/Email]
- **Supabase Support**: support@supabase.com
