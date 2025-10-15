# Next Moment Documentation Index

**Last Updated:** October 14, 2025 (Sprint Plan Update)  
**Project:** Next Moment v1 (rBuddy-v1)  
**Status:** Active Developm### Project Briefs

**Location:** `docs/` (root)

- [`project-brief.md`](./project-brief.md) - High-level project overview
- [`front-end-spec.md`](./front-end-spec.md) - Frontend specifications
- [`MIGRATION-GUIDE.md`](./MIGRATION-GUIDE.md) - Migration and upgrade guide
- [`pwa-pivot-progress.md`](./pwa-pivot-progress.md) - PWA pivot tracking
- [`vercel-deployment.md`](./vercel-deployment.md) - **[Critical]** Vercel serverless architecture guide
- [`CRITICAL_FIXES.md`](./CRITICAL_FIXES.md) - Recent critical security fixes for chat API
- **[`SPRINT_PLAN_UPDATE_2025-10-14.md`](./SPRINT_PLAN_UPDATE_2025-10-14.md)** - **NEW: Comprehensive sprint plan with AI stories**
- **[`REPAIR_FLOW_CONTENT_BLOCKER.md`](./REPAIR_FLOW_CONTENT_BLOCKER.md)** - **NEW: Story 4.1 blocker analysis** 4 Expanded (AI Integration)

---

## 📚 Quick Navigation

| Section | Description | Key Files |
|---------|-------------|-----------|
| [Product Requirements](#product-requirements-prd) | Vision, features, epics, and requirements | `prd.md`, `prd/` |
| [Architecture](#architecture) | Technical design, tech stack, data models | `architecture.md`, `architecture/` |
| [User Stories](#user-stories) | Development stories and implementation details | `stories/` |
| [Quality Assurance](#quality-assurance) | Testing, QA gates, and assessments | `qa/` |
| [UX Reviews](#ux-reviews) | Design reviews and accessibility audits | `ux-reviews/` |
| [Project Briefs](#project-briefs) | High-level overviews and migration guides | Root docs |

---

## 📋 Product Requirements (PRD)

**Primary Document:** [`docs/prd.md`](./prd.md) (v4, Sharded)

### Sharded PRD Files (`docs/prd/`)
- [`index.md`](./prd/index.md) - Navigation index for all PRD sections
- [`1-intro-project-analysis-and-context.md`](./prd/1-intro-project-analysis-and-context.md) - Project vision, goals, and context
- [`2-requirements.md`](./prd/2-requirements.md) - Functional and non-functional requirements
- [`3-epic-and-story-structure.md`](./prd/3-epic-and-story-structure.md) - Feature breakdown and epic structure

### Archive
- [`_archive/`](./prd/_archive/) - Previous PRD versions

---

## 🏗️ Architecture

**Primary Document:** [`docs/architecture.md`](./architecture.md) (v4, Sharded)

### Sharded Architecture Files (`docs/architecture/`)
- [`index.md`](./architecture/index.md) - Navigation index for all architecture sections
- [`1-introduction.md`](./architecture/1-introduction.md) - System overview and design philosophy
- [`2-enhancement-scope-and-integration-strategy.md`](./architecture/2-enhancement-scope-and-integration-strategy.md) - Integration approach
- [`3-tech-stack.md`](./architecture/3-tech-stack.md) - **[Dev Load Always]** Technology choices
- [`4-data-models-and-schema-changes.md`](./architecture/4-data-models-and-schema-changes.md) - Database schema and migrations
- [`5-component-architecture.md`](./architecture/5-component-architecture.md) - Frontend component structure
- [`6-api-design-and-integration.md`](./architecture/6-api-design-and-integration.md) - API endpoints and backend design
- [`7-external-api-integration.md`](./architecture/7-external-api-integration.md) - Third-party integrations
- [`8-source-tree.md`](./architecture/8-source-tree.md) - **[Dev Load Always]** Project directory structure
- [`9-infrastructure-and-deployment-integration.md`](./architecture/9-infrastructure-and-deployment-integration.md) - Deployment and infrastructure
- [`10-coding-standards-testing-and-security.md`](./architecture/10-coding-standards-testing-and-security.md) - **[Dev Load Always]** Code standards and best practices

### Archive
- [`_archive/`](./architecture/_archive/) - Previous architecture versions

---

## 📖 User Stories

**Location:** `docs/stories/`

### Epic 1: Authentication & User Management (Google OAuth)
| Story | Status | File | Description |
|-------|--------|------|-------------|
| 1.1 | ✅ Complete | [`1.1.update-db-schema-for-oauth.md`](./stories/1.1.update-db-schema-for-oauth.md) | Database schema for OAuth |
| 1.1 Merge | ✅ Complete | [`1.1-merge-summary.md`](./stories/1.1-merge-summary.md) | Merge summary |
| 1.2 | ✅ Complete | [`1.2.implement-backend-oauth-callback.md`](./stories/1.2.implement-backend-oauth-callback.md) | Backend OAuth callback |
| 1.2 Testing | ✅ Complete | [`1.2-manual-testing.md`](./stories/1.2-manual-testing.md) | Manual testing guide |
| 1.3 | ✅ Complete | [`1.3.build-frontend-login-ui.md`](./stories/1.3.build-frontend-login-ui.md) | Frontend login UI |
| 1.4 | ✅ Complete | [`1.4.implement-protected-routes-and-logout.md`](./stories/1.4.implement-protected-routes-and-logout.md) | Protected routes & logout |
| 1.5 | ✅ Complete | [`1.5-daily-ritual-pwa-backend.md`](./stories/1.5-daily-ritual-pwa-backend.md) | Daily Ritual PWA backend |

### Epic 2: Feature Deactivation
| Story | Status | File | Description |
|-------|--------|------|-------------|
| 2.1 | 📋 Draft | [`2.1.deactivate-twilio-functionality.md`](./stories/2.1.deactivate-twilio-functionality.md) | Deactivate Twilio features (deferred) |

### Epic 3: Daily Ritual Core Features
| Story | Status | File | Description |
|-------|--------|------|-------------|
| 3.1 | ✅ Complete | [`3.1.fix-daily-ritual-persistence.md`](./stories/3.1.fix-daily-ritual-persistence.md) | Fix session persistence |

### Epic 4: PWA Rupture & Repair Support Flow
| Story | Status | File | Description |
|-------|--------|------|-------------|
| 4.1 | ⚠️ BLOCKED | [`4.1.implement-pwa-rupture-and-repair-flow.md`](./stories/4.1.implement-pwa-rupture-and-repair-flow.md) | Implement repair flow (content validation blocker) |
| **4.1A** | 📋 **Draft** | [`4.1A.ai-powered-repair-suggestions.md`](./stories/4.1A.ai-powered-repair-suggestions.md) | **NEW: AI-powered backend (Google Gemini)** |
| **4.1B** | 📋 **Draft** | [`4.1B.ai-powered-repair-frontend.md`](./stories/4.1B.ai-powered-repair-frontend.md) | **NEW: AI-powered frontend (enhanced UX)** |
| 4.2 | ✅ Complete | [`4.2.improve-repair-flow-accessibility.md`](./stories/4.2.improve-repair-flow-accessibility.md) | Improve repair accessibility |
| 4.3 | ✅ Complete | [`4.3.implement-app-navigation.md`](./stories/4.3.implement-app-navigation.md) | App navigation & hamburger menu |

**Epic 4 Status:** 🔄 **In Progress** (3/5 complete, 1 blocked, 2 new AI stories)

**Critical Path:**
```
Story 4.1 (BLOCKED - hardcoded content insufficient)
    ↓
Story 4.1A (AI Backend) → 3-4 days
    ↓
Story 4.1B (AI Frontend) → 2-3 days
    ↓
Story 4.1 (UNBLOCKED → Done)
```

**Blocker Details:**
- **Issue:** Hardcoded repair suggestions lack therapeutic depth
- **Identified:** October 14, 2025 by Product Owner
- **Solution:** AI-powered contextual responses (Stories 4.1A + 4.1B)
- **Reference:** [`REPAIR_FLOW_CONTENT_BLOCKER.md`](./REPAIR_FLOW_CONTENT_BLOCKER.md)
- **AI Provider:** Google Gemini (with evidence-based prompt engineering)

### Epic 5: Journaling Feature
| Story | Status | File | Description |
|-------|--------|------|-------------|
| 5.1 | 🔍 Ready for Review | [`5.1.implement-journaling-feature.md`](./stories/5.1.implement-journaling-feature.md) | Implement journaling (needs 5-min test fix) |
| 5.2 | ✅ Complete | [`5.2.view-journal-history.md`](./stories/5.2.view-journal-history.md) | View journal history |
| 5.3 | ✅ Complete | [`5.3.search-and-filter-journal.md`](./stories/5.3.search-and-filter-journal.md) | Search and filter journal entries |

**Epic 5 Status:** 🔄 **Near Complete** (2/3 done, 1 needs quick fix)

**Story 5.1 Quick Fix:**
- **Issue:** 3 component tests failing (ambiguous selector)
- **Fix:** Change `getByLabelText` → `getByRole('textbox')` in 3 locations
- **Time:** 5 minutes
- **Reference:** [`qa/PENDING_STORIES_REVIEW_SUMMARY.md`](./qa/PENDING_STORIES_REVIEW_SUMMARY.md)

### Ad-Hoc Features (No Formal Story)
| Feature | Status | Documentation | Description |
|---------|--------|---------------|-------------|
| AI Chat Widget | ✅ Complete | [`ai-chat.md`](./ai-chat.md), [`ai-chat-architecture.md`](./ai-chat-architecture.md) | Floating chat widget with multi-provider AI support (OpenAI, Anthropic) - implemented outside sprint process |

**Note:** AI Chat Widget was added as an ad-hoc feature without going through the formal story process. See `CRITICAL_FIXES.md` for security improvements applied to chat endpoints (rate limiting, validation).

### Archive
- [`_archive/`](./stories/_archive/) - Deprecated or superseded stories

---

## 🧪 Quality Assurance

**Location:** `docs/qa/`

### QA Reports
- [`story-4.1-review-summary.md`](./qa/story-4.1-review-summary.md) - Story 4.1 QA review

### Subdirectories
- [`assessments/`](./qa/assessments/) - Detailed QA assessments
- [`gates/`](./qa/gates/) - QA gate approvals and checklists

---

## 🎨 UX Reviews

**Location:** `docs/ux-reviews/`

- [`summary.md`](./ux-reviews/summary.md) - Overall UX review summary
- [`4.2-support-widget-review-request.md`](./ux-reviews/4.2-support-widget-review-request.md) - Story 4.2 UX review (led to Story 4.3)
- [`repair-flow-access-alternatives.md`](./ux-reviews/repair-flow-access-alternatives.md) - Alternative repair flow designs

---

## 📄 Project Briefs

**Location:** `docs/` (root)

- [`project-brief.md`](./project-brief.md) - High-level project overview
- [`front-end-spec.md`](./front-end-spec.md) - Frontend specifications
- [`MIGRATION-GUIDE.md`](./MIGRATION-GUIDE.md) - Migration and upgrade guide
- [`pwa-pivot-progress.md`](./pwa-pivot-progress.md) - PWA pivot tracking
- [`vercel-deployment.md`](./vercel-deployment.md) - **[Critical]** Vercel serverless architecture guide
- [`CRITICAL_FIXES.md`](./CRITICAL_FIXES.md) - Recent critical security fixes for chat API

### Ad-Hoc Feature Documentation
- [`ai-chat.md`](./ai-chat.md) - AI Chat widget feature overview
- [`ai-chat-architecture.md`](./ai-chat-architecture.md) - AI Chat technical architecture
- [`ai-chat-quick-reference.md`](./ai-chat-quick-reference.md) - AI Chat API quick reference
- [`ai-providers.md`](./ai-providers.md) - Multi-provider AI integration (OpenAI, Anthropic)

### Archive
- [`old.prd.md`](./old.prd.md) - Previous PRD version
- [`old.architecture.md`](./old.architecture.md) - Previous architecture version

---

## 🔧 Development Quick Reference

### Essential Files for Developers (Auto-loaded)
These files are automatically loaded by the BMAD system for dev agents:

1. **[`docs/architecture/10-coding-standards-testing-and-security.md`](./architecture/10-coding-standards-testing-and-security.md)**  
   Code style, testing patterns, security best practices

2. **[`docs/architecture/3-tech-stack.md`](./architecture/3-tech-stack.md)**  
   Tech stack: React 18, TypeScript, Express, PostgreSQL, Drizzle ORM

3. **[`docs/architecture/8-source-tree.md`](./architecture/8-source-tree.md)**  
   Project structure and file organization

### Critical Architecture Notes

⚠️ **IMPORTANT: Vercel Serverless Architecture (Updated Oct 2025)**

This project uses a **decoupled dual-export pattern** for API endpoints:

- **Development**: Express server (`api/index.ts`) handles all routes via `server/routes.ts`
- **Production**: Each file in `api/` directory becomes an independent Vercel serverless function

**Key Points:**
- ✅ API endpoints in `api/` directory are NOT duplicates - they ARE the endpoints
- ✅ `server/routes.ts` imports the `middlewares` export for local dev
- ✅ Vercel imports the `default` export for serverless deployment
- ✅ Each endpoint file must have BOTH exports (see `vercel-deployment.md`)
- ❌ DO NOT create separate Express routes outside of `api/` directory
- ❌ DO NOT remove `api/` endpoints thinking they're duplicates

**Required Reading:** [`docs/vercel-deployment.md`](./vercel-deployment.md) - Explains dual-export pattern

**Recent Changes:**
- October 2025: Chat API security fixes (rate limiting, validation) - see `CRITICAL_FIXES.md`
- October 2025: AI Chat widget added as ad-hoc feature (no formal story) - see `ai-chat.md`

### Configuration Files
- **BMAD Core Config:** `.bmad-core/core-config.yaml`
- **AI Instructions:** `.github/copilot-instructions.md`, `AGENTS.md`

---

## 📊 Document Status Legend

| Symbol | Status | Description |
|--------|--------|-------------|
| ✅ | Complete | Implemented and merged |
| � | Ready for Review | Needs QA review or minor fix |
| ⚠️ | BLOCKED | Cannot proceed due to blocker |
| �🚧 | Ready | Approved and ready for development |
| 🔄 | In Progress | Currently being implemented |
| 📋 | Draft/Planned | Defined but not yet started |
| ⏸️ | Deferred | On hold pending other work |
| 🗄️ | Archive | Superseded or deprecated |

---

## 🗂️ File Naming Conventions

### Stories
- Pattern: `{epic}.{story}.{description}.md`
- Example: `4.3.implement-app-navigation.md`

### Architecture Sections
- Pattern: `{number}-{description}.md`
- Example: `3-tech-stack.md`

### PRD Sections
- Pattern: `{number}-{description}.md`
- Example: `2-requirements.md`

---

## 🔍 How to Find What You Need

| I want to... | Look here |
|-------------|-----------|
| Understand project vision and goals | [`prd/1-intro-project-analysis-and-context.md`](./prd/1-intro-project-analysis-and-context.md) |
| See feature requirements | [`prd/2-requirements.md`](./prd/2-requirements.md) |
| **See current sprint status** | **[`SPRINT_PLAN_UPDATE_2025-10-14.md`](./SPRINT_PLAN_UPDATE_2025-10-14.md)** ⭐ |
| Understand tech stack | [`architecture/3-tech-stack.md`](./architecture/3-tech-stack.md) |
| Find coding standards | [`architecture/10-coding-standards-testing-and-security.md`](./architecture/10-coding-standards-testing-and-security.md) |
| See database schema | [`architecture/4-data-models-and-schema-changes.md`](./architecture/4-data-models-and-schema-changes.md) |
| Find API endpoints | [`architecture/6-api-design-and-integration.md`](./architecture/6-api-design-and-integration.md) |
| Implement a feature | [`stories/`](./stories/) (find your epic/story) |
| **Understand repair flow blocker** | **[`REPAIR_FLOW_CONTENT_BLOCKER.md`](./REPAIR_FLOW_CONTENT_BLOCKER.md)** 🔥 |
| Review QA status | [`qa/`](./qa/) |
| See UX feedback | [`ux-reviews/`](./ux-reviews/) |
| Understand project structure | [`architecture/8-source-tree.md`](./architecture/8-source-tree.md) |
| Learn about AI Chat widget | [`ai-chat.md`](./ai-chat.md) |

---

## 📝 Notes

- **Sharded Documents:** Both PRD and Architecture use "markdown explosion" (sharding) for better maintainability
- **Version:** Current documentation is at v4 for both PRD and Architecture
- **Story Location:** All user stories are in `docs/stories/`
- **QA Location:** All QA artifacts are in `docs/qa/`
- **Dev Workflow:** Stories follow a standard template with Tasks, Acceptance Criteria, and Testing sections

---

## 🚀 Current Sprint Focus (Updated October 14, 2025)

**Sprint Status:** 67% Complete (10 of 15 stories done)

### 🎯 Immediate Priorities

**1. Story 5.1 Quick Fix** (5 minutes)
- **File:** [`5.1.implement-journaling-feature.md`](./stories/5.1.implement-journaling-feature.md)
- **Status:** Ready for Review → Needs test selector fix
- **Action:** Change `getByLabelText` to `getByRole('textbox')` in 3 locations
- **Result:** Epic 5 complete ✅

**2. Story 4.1A - AI Backend** (3-4 days) 🔥 HIGH PRIORITY
- **File:** [`4.1A.ai-powered-repair-suggestions.md`](./stories/4.1A.ai-powered-repair-suggestions.md)
- **Status:** Draft → Ready for Implementation
- **Goal:** Replace hardcoded repair suggestions with AI-generated responses
- **AI Provider:** Google Gemini
- **Includes:** Evidence-based prompts, SAMHSA hotline integration, fallback strategy

**3. Story 4.1B - AI Frontend** (2-3 days)
- **File:** [`4.1B.ai-powered-repair-frontend.md`](./stories/4.1B.ai-powered-repair-frontend.md)
- **Status:** Draft → Depends on 4.1A
- **Goal:** Enhanced loading state, scrollable UI, SAMHSA highlight
- **UX:** Compassionate 2-5 second loading experience

### 📊 Epic Completion Status

| Epic | Complete | In Progress | Blocked | Draft | Total |
|------|----------|-------------|---------|-------|-------|
| **Epic 1** (Auth) | 5 | - | - | - | **5** ✅ 100% |
| **Epic 2** (Twilio) | - | - | - | 1 | **1** 📋 Deferred |
| **Epic 3** (Ritual) | 1 | - | - | - | **1** ✅ 100% |
| **Epic 4** (Repair) | 3 | - | 1 | 2 | **6** 🔄 50% |
| **Epic 5** (Journal) | 2 | 1 | - | - | **3** 🔄 67% |
| **TOTAL** | **11** | **1** | **1** | **3** | **16** |

### 🗓️ Timeline

```
TODAY (Oct 14)
  └─ Fix Story 5.1 (5 min) → Epic 5 complete ✅

THIS WEEK (Oct 15-18)
  └─ Story 4.1A Backend (3-4 days)
     • RepairAIService class
     • Google Gemini integration
     • Evidence-based prompts
     • Safety rails & validation

NEXT WEEK (Oct 21-23)
  └─ Story 4.1B Frontend (2-3 days)
     • Enhanced loading state
     • Scrollable container
     • SAMHSA highlight
     
  └─ Story 4.1 UNBLOCKED → Done
  └─ Epic 4 Complete ✅

POST-IMPLEMENTATION (Oct 24+)
  └─ Expert consultation (recovery specialist)
  └─ Sprint retrospective
```

### 🔗 Key References
- **Sprint Plan:** [`SPRINT_PLAN_UPDATE_2025-10-14.md`](./SPRINT_PLAN_UPDATE_2025-10-14.md) - Full sprint analysis
- **Blocker Doc:** [`REPAIR_FLOW_CONTENT_BLOCKER.md`](./REPAIR_FLOW_CONTENT_BLOCKER.md) - Problem definition
- **QA Summary:** [`qa/PENDING_STORIES_REVIEW_SUMMARY.md`](./qa/PENDING_STORIES_REVIEW_SUMMARY.md) - Stories 4.1 & 5.1 review

**Recently Completed:**
- ✅ Story 5.3 - Search and Filter Journal (October 14, 2025)
- ✅ Story 5.2 - View Journal History (October 13, 2025)
- ✅ Story 4.3 - App Navigation & Hamburger Menu (October 12, 2025)

---

*This index is maintained by the BMAD system and updated with each significant documentation change.*
