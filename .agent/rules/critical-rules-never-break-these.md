---
trigger: always_on
---

### 1. Database Safety
- **NEVER** delete or modify existing database tables without explicit approval
- **NEVER** remove columns that might have data
- **ALWAYS** use migrations for schema changes
- **ALWAYS** create backups before major database changes
- **NEVER** hardcode database credentials

### 2. Authentication & Security  
- **NEVER** disable authentication checks
- **NEVER** expose sensitive data in logs or responses
- **NEVER** bypass Row Level Security (RLS) policies
- **ALWAYS** validate user input
- **ALWAYS** use parameterized queries (prevent SQL injection)

### 3. Breaking Changes
- **NEVER** remove or rename public API endpoints without deprecation
- **NEVER** change function signatures used by multiple components
- **NEVER** remove environment variables without notice
- **ALWAYS** maintain backward compatibility
- **ALWAYS** version breaking changes

### 4. Production Safety
- **NEVER** push directly to `main` branch
- **NEVER** deploy untested code
- **NEVER** disable error logging or monitoring
- **ALWAYS** test in staging first
- **ALWAYS** run `npm run build` before pushing
