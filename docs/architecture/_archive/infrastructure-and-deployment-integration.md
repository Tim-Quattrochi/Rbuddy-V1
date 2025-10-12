# Infrastructure and Deployment Integration

## Existing Infrastructure

- **Current Deployment**: None (local development only)
- **Infrastructure Tools**: None
- **Environments**: Development only

## Enhancement Deployment Strategy

**Platform**: Vercel (Free Tier)

**Deployment Approach**:
1. **Frontend**: Static site generation (Vite build → `public/`)
2. **Backend**: Serverless functions (`api/` directory auto-deploys)
3. **Database**: Neon PostgreSQL (external, connection pooling built-in)
4. **Scheduled Tasks**: Vercel Cron (daily reminders)

**Note**: The build output directory was changed from `client/dist/` to `public/` to align with Vercel's serverless function requirements and avoid conflicts with the `api/` directory structure.

**Infrastructure Changes**:
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "public",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ],
  "crons": [
    {
      "path": "/api/cron/daily-reminders",
      "schedule": "0 9 * * *"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "TWILIO_ACCOUNT_SID": "@twilio_account_sid",
    "TWILIO_AUTH_TOKEN": "@twilio_auth_token",
    "TWILIO_PHONE_NUMBER": "@twilio_phone_number"
  }
}
```

**ConversationEngine State Management**:
The ConversationEngine currently uses static in-memory state storage for MVP simplicity. This approach has limitations in serverless environments:
- State is lost during cold starts
- Does not support multi-instance deployments
- Not suitable for production scale

For production deployment, migrate to Redis-backed session storage or database-backed state management to ensure conversation continuity across serverless function invocations.

**Pipeline Integration**:
- Git push → Vercel auto-deploys (no CI/CD config needed)
- Environment variables set in Vercel dashboard
- Preview deployments for each PR

## Rollback Strategy

**Rollback Method**: Vercel instant rollback (click previous deployment)
**Risk Mitigation**:
- Test Twilio webhooks in Vercel preview environments first
- Use Twilio Studio for complex IVR flows (no-code fallback)
- Database migrations are additive only (no drops)

**Monitoring**:
- Vercel Analytics (free tier: web vitals)
- Vercel Logs (serverless function logs)
- Twilio Console (SMS/Voice logs and errors)
