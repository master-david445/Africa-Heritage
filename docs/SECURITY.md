# Security Documentation

## Overview
This document outlines the security measures implemented in the Africa-Heritage platform to protect user data and ensure system integrity.

## Authentication & Authorization

### Password Security
- **Verification**: Critical actions (email change, password change) require current password verification.
- **Complexity**: Passwords must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.
- **Hashing**: Passwords are hashed using Supabase Auth (bcrypt/argon2).

### Rate Limiting
We use Upstash Redis to rate limit sensitive endpoints:
- **Login**: 5 attempts per 15 minutes.
- **Email Change**: 2 attempts per hour.
- **Password Change**: 3 attempts per hour.
- **Profile Updates**: 10 attempts per minute.
- **API Requests**: 100 requests per minute.

### Session Management
- **Cookies**: All auth cookies are set with `httpOnly: true`, `secure: true` (in production), and `sameSite: 'lax'`.
- **CSRF Protection**: Middleware validates `Origin` and `Referer` headers for state-changing requests.

## Data Protection

### Row Level Security (RLS)
All database tables have RLS enabled. Policies strictly control access:
- **Profiles**: Public read access (restricted in future), owner write access.
- **Private Data**: Email and sensitive fields are protected (or will be moved to private tables).
- **Audit Logs**: Only admins can view security audit logs.

### Input Validation
- **Zod Schemas**: All user inputs are validated using Zod schemas before processing.
- **SQL Injection**: We use parameterized queries (via Supabase SDK) to prevent SQL injection.
- **XSS**: React automatically escapes content. We also sanitize inputs where necessary.

## Audit Logging
We track security-critical events in the `security_audit_log` table:
- Email changes
- Password changes
- Login attempts (planned)
- Failed logins (planned)

## Infrastructure
- **Headers**: Security headers (X-Frame-Options, X-Content-Type-Options, etc.) are configured in `next.config.mjs`.
- **Middleware**: Global middleware handles session refresh and CSRF checks.

## Future Improvements
- Implement 2FA (Two-Factor Authentication).
- stricter RLS for user emails.
- Automated security scanning in CI/CD.
