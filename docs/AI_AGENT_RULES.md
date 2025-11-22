# AI Agent Development Rules
## African Heritage Platform

These rules MUST be followed by any AI agent making changes to this codebase.

---

## 🚫 Critical Rules - NEVER Break These

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

---

## ⚠️ Warning Rules - Proceed with Caution

### 1. Performance Impact
- **AVOID** adding synchronous operations in critical paths
- **AVOID** N+1 queries (use joins or batch fetching)
- **AVOID** loading large datasets without pagination
- **WARN** if adding dependencies >500KB
- **CONSIDER** lazy loading for heavy components

### 2. User Experience
- **AVOID** blocking UI with long operations
- **AVOID** removing loading states
- **AVOID** removing error messages
- **ENSURE** mobile responsiveness for all changes
- **TEST** on slow 3G connections

### 3. Data Integrity
- **AVOID** cascading deletes without confirmation
- **AVOID** auto-incrementing IDs (use UUIDs)
- **VALIDATE** all user inputs
- **SANITIZE** HTML content
- **CHECK** for duplicate prevention

---

## ✅ Best Practices - Follow These

### 1. Code Quality
- **USE** TypeScript for all new code
- **WRITE** JSDoc comments for exported functions
- **FOLLOW** existing code style
- **EXTRACT** repeated code into utilities
- **LIMIT** function complexity (<50 lines)

### 2. Testing
- **WRITE** unit tests for utilities
- **WRITE** integration tests for APIs
- **TEST** error cases, not just happy paths
- **CHECK** edge cases (empty arrays, null values, etc.)
- **VERIFY** mobile and desktop views

### 3. Documentation
- **UPDATE** README when adding major features
- **DOCUMENT** non-obvious code decisions
- **MAINTAIN** API documentation
- **ADD** examples for complex functions
- **EXPLAIN** workarounds or hacks

### 4. Git Practices
- **USE** conventional commits:
  - `feat:` for features
  - `fix:` for bug fixes
  - `refactor:` for refactoring
  - `docs:` for documentation
  - `test:` for tests
- **WRITE** clear commit messages
- **REFERENCE** issue numbers
- **SQUASH** work-in-progress commits

---

## 🔍 Pre-Commit Checklist

Before making any code changes, verify:

- [ ] I understand the full impact of this change
- [ ] I have checked for dependent code
- [ ] I will not break existing functionality
- [ ] I will maintain security standards
- [ ] I will test the changes
- [ ] I will update documentation if needed

---

## 🛠️ When Adding New Features

### Required Steps:

1. **Understand Requirements**
2. **Check Dependencies**
3. **Design First**
4. **Implement** (with error handling, loading states, mobile responsiveness)
5. **Test** (unit, manual, cross-browser, mobile)
6. **Document**
7. **Review**
8. **Deploy** (staging → production)

---

## 📋 Code Review Criteria

- [ ] Code follows TypeScript best practices
- [ ] No console.logs left in
- [ ] Error handling is present
- [ ] Loading states exist for async operations
- [ ] User input is validated
- [ ] Security best practices followed
- [ ] No hardcoded values (use env vars)
- [ ] Responsive design maintained
- [ ] Accessibility considered
- [ ] Performance impact is minimal
- [ ] Database queries are optimized
- [ ] Tests are included
- [ ] Documentation is updated

---

**Last Updated:** 2025-11-22  
**Version:** 1.0
