# Next Steps

## Immediate Actions (Priority Order)

1. **Set up Neon PostgreSQL** (15 min)
   - Create free account at https://neon.tech
   - Create database, copy connection string
   - Update `DATABASE_URL` in `.env`

2. **Extend Drizzle Schema** (30 min)
   - Add `sessions`, `messages`, `voiceCalls`, `followUps` tables to `shared/schema.ts`
   - Run `npx drizzle-kit generate` → `npx drizzle-kit push`

3. **Create Twilio Account** (15 min)
   - Sign up at https://www.twilio.com/try-twilio (free trial)
   - Get phone number, copy Account SID + Auth Token
   - Add to Vercel environment variables

4. **Convert Express to API Routes** (2-3 hours)
   - Move `server/routes.ts` logic to `api/webhooks/twilio/sms.ts`
   - Create `server/services/conversationEngine.ts`
   - Create `server/data/messageTemplates.json`

5. **Build Dashboard UI** (2-3 hours)
   - Create `client/src/pages/Dashboard.tsx`
   - Add `/api/dashboard/metrics.ts` endpoint
   - Reuse shadcn/ui `Card`, `Button` components

6. **Deploy to Vercel** (30 min)
   - `npm install -g vercel`
   - `vercel login`
   - `vercel --prod`
   - Configure Twilio webhook URL: `https://your-project.vercel.app/api/webhooks/twilio/sms`

7. **Test End-to-End** (1 hour)
   - Send SMS to Twilio number
   - Verify response received
   - Check dashboard shows session
   - Test click-to-call feature

## Story Manager Handoff

**Task**: Implement Reentry Buddy SMS/IVR pivot with investor demo dashboard

**Key Integration Requirements** (validated with user):
- Use existing Express.js codebase (convert to Vercel serverless)
- Keep PostgreSQL (migrate to Neon for connection pooling)
- Reuse React + shadcn/ui for dashboard
- Deploy to Vercel (free tier)

**Existing System Constraints** (based on actual project analysis):
- Monorepo structure (`client/`, `server/`, `shared/`)
- TypeScript strict mode enabled
- Drizzle ORM for database (keep existing patterns)
- No existing tests (start fresh with Vitest)

**First Story to Implement**:
**Story 1**: Set up Twilio SMS webhook with basic "echo" response

**Acceptance Criteria**:
1. Create `api/webhooks/twilio/sms.ts` Vercel function
2. Validate Twilio signature
3. Return TwiML response echoing received message
4. Log message to database (`messages` table)
5. Deploy to Vercel and test with real SMS

**Integration Checkpoints**:
- [ ] Twilio signature validation works
- [ ] Drizzle schema migration applied
- [ ] Vercel deployment successful
- [ ] Incoming SMS logged to database
- [ ] Response received on phone within 3 seconds

**Critical Path**: This story validates the entire Twilio → Vercel → Database pipeline

## Developer Handoff

**Reference Documents**:
- This architecture document
- PRD: `docs/prd.md`
- Existing codebase standards: `AGENTS.md`

**Integration Requirements with Existing Codebase**:
1. **Database**: Extend `shared/schema.ts` (do not replace)
2. **Imports**: Use existing path aliases (`@/components`, `@/lib`)
3. **Styling**: Follow Tailwind config in `tailwind.config.ts`
4. **Components**: Reuse shadcn/ui from `client/src/components/ui/`

**Key Technical Decisions** (based on real project constraints):
- Vercel serverless functions (not traditional Express server)
- Neon PostgreSQL (not local/Render PostgreSQL)
- TanStack Query polling (not WebSockets) for dashboard
- Vercel Cron (not node-cron) for scheduled messages

**Existing System Compatibility Requirements**:
1. **Schema Migration**: Use Drizzle Kit (`npx drizzle-kit push`)
   - Verify existing `users` table not modified
   - Run in staging first (Neon branch)

2. **Import Patterns**: Match existing style
   ```typescript
   // ✅ Correct
   import { db } from '@/server/storage';
   import { Button } from '@/components/ui/button';

   // ❌ Wrong
   import { db } from '../../../server/storage';
   ```

3. **Error Handling**: Always return 200 to Twilio (even on errors)
   ```typescript
   // Twilio requires 200 response to prevent retries
   try {
     const response = await process();
     res.status(200).send(twiml(response));
   } catch (error) {
     res.status(200).send(twiml('Please try again.'));
   }
   ```

**Clear Sequencing** (minimize risk to existing functionality):
1. ✅ **Phase 1**: Add new tables (no impact on existing code)
2. ✅ **Phase 2**: Create API routes (new files, no conflicts)
3. ✅ **Phase 3**: Build dashboard (replace unused `Landing.tsx`)
4. ✅ **Phase 4**: Deploy to Vercel (new platform, no migration)

**Timeline**: 8 days (October 10-17, 2025)
- Days 1-2: Database + API routes
- Days 3-4: Conversation engine + message templates
- Days 5-6: Dashboard UI + click-to-call
- Day 7: End-to-end testing
- Day 8: Deploy + demo prep
