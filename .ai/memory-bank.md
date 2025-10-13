# Next Moment - Project Memory Bank
**Last Updated**: 2025-10-13
**Project Status**: Backend Decoupled - OAuth Flow Fixed

---

## 🎯 Project Overview

**Name**: Next Moment  
**Purpose**: Wellness-focused PWA for recovery support with daily check-ins, goal tracking, and emotional support  
**Tech Stack**: React 19 + TypeScript, Express, PostgreSQL, Drizzle ORM, TanStack Query, shadcn/ui, Tailwind CSS  
**Current Phase**: MVP Implementation - Story 12 Complete with Critical Fixes

---

## 📋 Current Sprint Status

### Story 12: PWA Daily Ritual Flow - COMPLETE WITH FIXES ✅
**Date Completed**: 2025-10-11  
**Status**: All critical issues resolved, ready for QA re-review

#### What Was Implemented
1. Daily ritual flow with mood selection, affirmation, and intention capture
2. Four React components: MoodSelector, AffirmationCard, IntentionInput, StreakCounter
3. Three API endpoints: POST /api/daily-ritual/mood, POST /api/daily-ritual/intention, GET /api/user/stats
4. Complete PWA offline support with background sync
5. Streak calculation with proper date handling
6. Full interaction logging to database

#### Critical Fixes Applied (2025-10-11)
1. **JWT Authentication** - All API endpoints now require valid JWT tokens
2. **Background Sync** - Workbox configured with queue for offline requests
3. **Interaction Logging** - Complete audit trail for mood, affirmation, and intention
4. **Streak Calculation** - Rewritten with proper date normalization and edge case handling
5. **Error Handling** - Comprehensive UI feedback with toast notifications and retry logic
6. **Type Safety** - Moved shared types to shared/schema.ts

**Documentation**: See [`docs/stories/s12-critical-fixes.md`](../docs/stories/s12-critical-fixes.md) for complete details

---

## 🏗️ Architecture Overview

### Frontend Structure
```
client/src/
├── pages/
│   ├── Landing.tsx - Entry point
│   ├── DailyRitual.tsx - Main PWA daily check-in flow
│   └── not-found.tsx
├── components/
│   ├── daily-ritual/
│   │   ├── MoodSelector.tsx - 4 mood button grid
│   │   ├── AffirmationCard.tsx - Displays supportive message
│   │   ├── IntentionInput.tsx - Optional daily intention input
│   │   └── StreakCounter.tsx - Shows consecutive day streak
│   └── ui/ - shadcn/ui components
└── lib/
    ├── queryClient.ts - TanStack Query config
    └── utils.ts - Utility functions
```

### Backend Structure
```
server/
├── middleware/
│   └── auth.ts - JWT authentication
├── services/
│   ├── conversationEngine.ts - FSM logic for SMS and PWA
│   └── AuthService.ts - Passport OAuth configuration
├── routes.ts - Express route registration
└── storage.ts - Database connection

api/
├── auth/
│   ├── google.ts - Google OAuth initiation
│   ├── google.callback.ts - OAuth callback handler
│   └── logout.ts - Logout endpoint
├── daily-ritual/
│   ├── mood.ts - POST endpoint for mood selection
│   └── intention.ts - POST endpoint for intention saving
└── user/
    └── stats.ts - GET endpoint for streak and trends
```

**Architecture Note**: Backend decoupled (2025-10-13)
- Backend: Express on port 5001
- Frontend: Vite on port 5173
- Proxy: Vite proxies `/api` to backend (see `vite.config.ts`)

### Database Schema
```
shared/schema.ts
├── users - User accounts with auth
├── sessions - Check-in sessions (daily-ritual, daily, repair)
├── interactions - All user interactions (SMS, PWA, IVR)
├── voiceCalls - IVR call records
└── followUps - Scheduled notifications
```

---

## 🔐 Authentication System

### Current Implementation
- **Middleware**: `server/middleware/auth.ts`
- **Method**: JWT tokens with 7-day expiration
- **Token Format**: `Authorization: Bearer <token>`
- **Secret**: Environment variable `JWT_SECRET`

### How It Works
1. User logs in → receives JWT token
2. Frontend stores token and sends in all API requests
3. `requireAuth()` middleware validates token on each request
4. Extracts `userId` from verified token
5. Rejects with 401 if invalid/missing

### Current Limitation
⚠️ **Temporary**: Frontend uses placeholder token for development  
📋 **TODO**: Implement login/signup flow and proper token storage

---

## 💾 Database Schema Key Points

### Enums
- **flowType**: `"daily" | "repair" | "daily-ritual"`
- **channel**: `"sms" | "ivr" | "pwa"`
- **mood**: `"calm" | "stressed" | "tempted" | "hopeful"`
- **contentType**: `"text" | "notification" | "reminder" | "mood_selection" | "affirmation_view" | "intention"`

### Critical Tables

#### sessions
```typescript
{
  id: uuid,
  userId: uuid (FK),
  flowType: enum,
  channel: enum,
  mood: enum?,
  intention: text?,
  streakCount: int,
  createdAt: timestamp
}
```

#### interactions
```typescript
{
  id: uuid,
  userId: uuid (FK),
  sessionId: uuid? (FK),
  direction: "inbound" | "outbound",
  channel: enum,
  contentType: enum,
  body: text,
  status: enum,
  metadata: jsonb,
  createdAt: timestamp
}
```

---

## 🔄 PWA Offline Strategy

### Service Worker Configuration
**File**: `vite.config.ts`

#### Caching Strategies
1. **Static Assets** (Fonts) - CacheFirst, 1-year expiration
2. **API POST/PUT** - NetworkOnly with BackgroundSync queue
3. **API GET** - NetworkFirst with 5-second timeout, 5-minute cache

#### Background Sync
- **Queue Name**: `daily-ritual-queue`
- **Retention**: 24 hours
- **Trigger**: Automatic retry when connection restored
- **Scope**: All failed API requests

### How Offline Works
1. User makes check-in while offline
2. Request fails → queued in `daily-ritual-queue`
3. UI shows optimistic update
4. When online → queue automatically retries
5. Success → data synced, optimistic update confirmed
6. Failure → optimistic update reverted, error shown

---

## 📊 Streak Calculation Algorithm

### Current Implementation
**File**: `api/user/stats.ts`

```typescript
// 1. Normalize all dates to midnight for comparison
function normalizeToMidnight(date: Date): Date

// 2. Calculate days between dates
function daysBetween(date1: Date, date2: Date): number

// 3. Calculate streak
async function calculateStreak(userId: string): Promise<number>
  - Fetch all sessions DESC by createdAt
  - Check if most recent is today or yesterday (else return 0)
  - Walk backwards counting consecutive days
  - Handle same-day multiple check-ins
  - Return total consecutive days
```

### Edge Cases Handled
✅ Midnight check-ins (11:59 PM → 12:01 AM)  
✅ Multiple same-day check-ins  
✅ Timezone normalization  
✅ Gaps in check-ins (streak breaks)  
✅ First-time users (streak = 0)

---

## 🧪 Testing Status

### Automated Tests
- ✅ Unit tests for all daily-ritual components
- ✅ API endpoint integration tests
- ⚠️ ConversationEngine tests (need update for new methods)
- ❌ Streak calculation edge case tests (TODO)
- ❌ DailyRitual page integration tests (TODO)

### Manual Testing Required
- [ ] JWT authentication with valid/invalid tokens
- [ ] Offline mode with background sync
- [ ] Streak calculation edge cases
- [ ] Error handling and retry flows
- [ ] Toast notifications

---

## 🚀 Deployment Configuration

### Environment Variables
```env
DATABASE_URL=postgresql://...
JWT_SECRET=<secure-random-string>
NODE_ENV=production
PORT=5000
```

### Pre-Deployment Checklist
- [ ] Set production JWT_SECRET
- [ ] Run database migrations
- [ ] Replace placeholder auth token in frontend
- [ ] Test on staging environment
- [ ] Lighthouse PWA audit (target: 90+)
- [ ] Security audit of JWT implementation

---

## 🐛 Known Issues & TODOs

### High Priority
1. **Authentication Context** - Replace placeholder token with proper auth flow
2. **Login/Signup Flow** - Implement user registration and login
3. **Token Refresh** - Add refresh token mechanism
4. **Migration Script** - Create SQL for schema enum updates

### Medium Priority
1. **Affirmation Animation** - Add fade-in animation to AffirmationCard
2. **Test Coverage** - Increase from 60% to 80%
3. **Error Monitoring** - Set up Sentry or similar
4. **Rate Limiting** - Add to API endpoints

### Low Priority
1. **Accessibility** - ARIA labels and keyboard navigation
2. **Loading Skeletons** - Better perceived performance
3. **Success Animations** - Celebration for streaks
4. **Dark Mode** - Theme switcher

---

## 📖 Key Files Reference

### Must-Read Files for New Developers
1. `docs/prd.md` - Product requirements
2. `docs/stories/s12.md` - Current story details
3. `docs/stories/s12-critical-fixes.md` - Recent fixes
4. `AGENTS.md` - Development standards
5. `shared/schema.ts` - Database schema and types

### Architecture Documentation
- `docs/architecture/` - Complete architecture docs
- `docs/architecture/tech-stack.md` - Technology decisions
- `docs/architecture/data-models-and-schema-changes.md` - Schema evolution

### Testing Documentation
- `docs/testing/mvp-manual-test-checklist.md` - Manual test guide
- `docs/testing/manual-sms-testing-guide.md` - SMS flow testing

---

## 🔗 API Endpoints

### Authentication Required (All)
**Header**: `Authorization: Bearer <jwt_token>`

### Endpoints

#### POST /api/daily-ritual/mood
**Purpose**: Record mood selection and get affirmation  
**Body**: `{ mood: "calm" | "stressed" | "tempted" | "hopeful" }`  
**Response**: `{ affirmation: string, sessionId: string }`  
**Creates**: Session + 2 interactions (mood_selection, affirmation_view)

#### POST /api/daily-ritual/intention
**Purpose**: Save daily intention text  
**Body**: `{ sessionId: string, intentionText: string }`  
**Response**: `{ success: true }`  
**Creates**: 1 interaction (intention)

#### GET /api/user/stats
**Purpose**: Get user streak and mood trends  
**Response**: `{ streakCount: number, moodTrends: Record<string, number> }`  
**Calculates**: Consecutive day streak from sessions

---

## 🎨 Design System

### Colors (Tailwind Config)
- **Primary**: #1a202e (dark wellness theme)
- **Background**: #ffffff
- **Mood Colors**: 
  - Calm: Blue tones
  - Stressed: Yellow/orange
  - Tempted: Red tones
  - Hopeful: Green/emerald

### Components
- **UI Library**: shadcn/ui (Radix primitives)
- **Icons**: Lucide React
- **Typography**: Inter font family
- **Mobile-First**: All components responsive

---

## 🔄 Git Workflow

### Branch Strategy
- `main` - Production
- `develop` - Integration
- `feature/*` - Feature branches
- `fix/*` - Bug fixes

### Commit Convention
```
feat: Add JWT authentication middleware
fix: Correct streak calculation for midnight edge case
docs: Update memory bank with S12 fixes
test: Add unit tests for MoodSelector
refactor: Move types to shared schema
```

---

## 💡 Recent Learnings

### What Worked Well
1. Using Drizzle ORM for type-safe database operations
2. TanStack Query for optimistic updates and error handling
3. shadcn/ui for rapid component development
4. Workbox for PWA offline support

### What Needed Fixing
1. Authentication was completely missing (security issue)
2. Background sync not configured (offline requirement)
3. Streak calculation had multiple logic errors
4. Interaction logging incomplete (audit trail gap)
5. **OAuth flow breaking after backend decoupling** (2025-10-13)

### Best Practices Established
1. Always use JWT authentication for API endpoints
2. Log all user interactions for audit trail
3. Implement comprehensive error handling with user feedback
4. Use shared types for client/server type safety
5. Normalize dates to midnight for day-based calculations
6. **OAuth flows require full browser redirects (`window.location.href`), never React Router navigation**
7. **Backend redirects in decoupled apps must use full frontend URLs, not relative paths**
8. **Always implement environment-aware URL handling for dev vs production**

---

## 📞 External Integrations

### Current
- **Twilio** - SMS messaging (existing)
- **Neon** - PostgreSQL database hosting

### Planned
- **Push Notifications** - PWA push for reminders
- **Firebase** - Optional auth provider
- **Analytics** - Usage tracking for pilot

---

## 🎯 Next Sprint Planning

### Immediate Next Steps
1. QA re-review of S12 critical fixes
2. Manual testing of authentication flow
3. Database migration for schema changes
4. Prepare for pilot testing

### Story 13 (Tentative)
- User authentication UI (login/signup)
- Token management and refresh
- Profile settings page
- Password reset flow

---

## 📚 Learning Resources

### Project-Specific
- React 19 Features: [React Docs](https://react.dev)
- Drizzle ORM: [Drizzle Docs](https://orm.drizzle.team)
- TanStack Query: [TanStack Query Docs](https://tanstack.com/query)
- Workbox: [Workbox Docs](https://developer.chrome.com/docs/workbox)

### Team Knowledge
- JWT Best Practices: See `server/middleware/auth.ts`
- PWA Patterns: See `vite.config.ts` and S11 docs
- Database Patterns: See `shared/schema.ts`
- Testing Patterns: See `__tests__` directories

---

## 🆘 Troubleshooting Guide

### Common Issues

#### "401 Unauthorized" on API calls
- Check JWT token is present in Authorization header
- Verify token hasn't expired (7-day expiration)
- Check JWT_SECRET environment variable matches

#### Google OAuth 404 errors
- **Frontend 404 on `/api/auth/google`**: Using `navigate()` instead of `window.location.href`
- **Backend redirect 404**: Backend redirecting to relative path instead of full frontend URL
- **Solution**: See `.ai/debug-log.md` entry from 2025-10-13

#### Streak count is incorrect
- Verify sessions have correct `flowType` ('daily-ritual' or 'daily')
- Check `createdAt` timestamps are in correct timezone
- Review streak calculation logic in `api/user/stats.ts`

#### Offline sync not working
- Check service worker is registered (DevTools → Application)
- Verify background sync is enabled in browser
- Check `daily-ritual-queue` in IndexedDB
- Confirm Workbox configuration in `vite.config.ts`

#### TypeScript errors on types
- Verify imports use `@shared/schema` for shared types
- Check `tsconfig.json` paths are configured
- Run `npm run typecheck` for full type checking

---

## 📊 Project Metrics

### Code Quality
- **TypeScript Coverage**: 100%
- **Test Coverage**: ~60% (target: 80%)
- **Linting**: ESLint + Prettier
- **Bundle Size**: TBD after build optimization

### Performance
- **Lighthouse PWA Score**: 90+ (target from S11)
- **First Contentful Paint**: TBD
- **Time to Interactive**: TBD

### Database
- **Tables**: 5 (users, sessions, interactions, voiceCalls, followUps)
- **Indexes**: On userId, sessionId, createdAt
- **Constraints**: Foreign keys, enums, not-null

---

## 🎓 For New Team Members

### Getting Started
1. Read `PROJECT_CONTEXT.md`
2. Review `docs/prd.md` for product vision
3. Read `AGENTS.md` for coding standards
4. Review this memory bank
5. Set up local environment (see README)
6. Run tests: `npm test`
7. Start dev server: `npm run dev`

### Key Concepts to Understand
- **PWA**: Progressive Web App - works offline, installable
- **FSM**: Finite State Machine - ConversationEngine pattern
- **JWT**: JSON Web Token - authentication method
- **Optimistic Updates**: UI updates before API confirms
- **Background Sync**: Automatic retry of failed requests

### Who to Ask
- **Architecture**: See `docs/architecture/`
- **API Design**: See `docs/architecture/api-design-and-integration.md`
- **Testing**: See `docs/testing/`
- **Database**: See `shared/schema.ts` and `docs/architecture/data-models-and-schema-changes.md`

---

**Memory Bank Version**: 1.0  
**Last Major Update**: Story 12 Critical Fixes (2025-10-11)  
**Next Review Date**: After Story 13 completion