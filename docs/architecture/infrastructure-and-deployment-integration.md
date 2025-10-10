# Infrastructure and Deployment Integration

## Existing Infrastructure

- **Current Deployment**: None (local development only)
- **Infrastructure Tools**: None
- **Environments**: Development only

## Enhancement Deployment Strategy

**Platform**: Vercel (Free Tier)

**Deployment Approach**:
1. **Frontend**: Static site generation (Vite build → `client/dist/`)
2. **Backend**: Serverless functions (`api/` directory auto-deploys)
3. **Database**: Neon PostgreSQL (external, connection pooling built-in)
4. **Scheduled Tasks**: Vercel Cron (daily reminders)

**Infrastructure Changes**:
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "client/dist",
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
    "TWILIO_ACCOUNT_SID": "@twilio-_account-_sid",
    "TWILIO_AUTH_TOKEN": "@twilio_auth_token",
    "TWILIO_PHONE_NUMBER": "@twilio_phone_number"
  }
}
```

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
