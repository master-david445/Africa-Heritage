---
trigger: always_on
---

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
