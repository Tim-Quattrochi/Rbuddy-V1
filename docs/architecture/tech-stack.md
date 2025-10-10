# Tech Stack

## Existing Technology Stack

| Category | Current Technology | Version | Usage in Enhancement | Notes |
|----------|-------------------|---------|----------------------|-------|
| **Frontend** | React | 19.x | ✅ Keep for demo UI | TypeScript + Vite |
| **UI Library** | shadcn/ui | Latest | ✅ Reuse components | Radix UI primitives |
| **Styling** | Tailwind CSS | 3.x | ✅ Keep design system | Wellness theme configured |
| **Backend** | Express.js | 4.x | ⚠️ Convert to serverless | Migrate to Vercel API routes |
| **Database** | PostgreSQL | 13+ | ✅ Keep (migrate to Neon) | Drizzle ORM stays |
| **ORM** | Drizzle | Latest | ✅ Keep | Type-safe queries |
| **State Management** | TanStack Query | 5.x | ✅ Keep | For dashboard data |
| **Auth** | Passport.js | Latest | ❌ Not needed for MVP | SMS uses phone numbers |
| **Deployment** | None | - | ➕ Add Vercel | Serverless functions |

## New Technology Additions

| Technology | Version | Purpose | Rationale | Integration Method |
|------------|---------|---------|-----------|-------------------|
| **Twilio SDK** | `^5.0.0` | SMS/Voice API | Industry standard for telephony | `npm i twilio` |
| **Neon PostgreSQL** | Free tier | Database hosting | Vercel-compatible connection pooling | Replace `DATABASE_URL` |
| **Vercel Cron** | Built-in | Scheduled messages | Daily check-in reminders | `vercel.json` config |
| **TwiML** | N/A | Voice response markup | Build IVR flows | Twilio's XML format |
