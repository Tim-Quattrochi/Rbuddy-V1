# Next Moment Documentation Index

**Last Updated:** October 12, 2025  
**Project:** Next Moment v1 (rBuddy-v1)  
**Status:** Active Development

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
| 2.1 | ✅ Complete | [`2.1.deactivate-twilio-functionality.md`](./stories/2.1.deactivate-twilio-functionality.md) | Deactivate Twilio features |

### Epic 3: Daily Ritual Core Features
| Story | Status | File | Description |
|-------|--------|------|-------------|
| 3.1 | ✅ Complete | [`3.1.fix-daily-ritual-persistence.md`](./stories/3.1.fix-daily-ritual-persistence.md) | Fix session persistence |

### Epic 4: PWA Rupture & Repair Support Flow
| Story | Status | File | Description |
|-------|--------|------|-------------|
| 4.1 | ✅ Complete | [`4.1.implement-pwa-rupture-and-repair-flow.md`](./stories/4.1.implement-pwa-rupture-and-repair-flow.md) | Implement repair flow |
| 4.2 | ✅ Complete | [`4.2.improve-repair-flow-accessibility.md`](./stories/4.2.improve-repair-flow-accessibility.md) | Improve repair accessibility |
| 4.3 | 🚧 Ready | [`4.3.implement-app-navigation.md`](./stories/4.3.implement-app-navigation.md) | **[CURRENT]** App navigation & hamburger menu |

### Epic 5: Journaling Feature
| Story | Status | File | Description |
|-------|--------|------|-------------|
| 5.1 | 📋 Planned | [`5.1.implement-journaling-feature.md`](./stories/5.1.implement-journaling-feature.md) | Implement journaling |

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

### Configuration Files
- **BMAD Core Config:** `.bmad-core/core-config.yaml`
- **AI Instructions:** `.github/copilot-instructions.md`, `AGENTS.md`

---

## 📊 Document Status Legend

| Symbol | Status | Description |
|--------|--------|-------------|
| ✅ | Complete | Implemented and merged |
| 🚧 | Ready | Approved and ready for development |
| 🔄 | In Progress | Currently being implemented |
| 📋 | Planned | Defined but not yet started |
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
| Understand tech stack | [`architecture/3-tech-stack.md`](./architecture/3-tech-stack.md) |
| Find coding standards | [`architecture/10-coding-standards-testing-and-security.md`](./architecture/10-coding-standards-testing-and-security.md) |
| See database schema | [`architecture/4-data-models-and-schema-changes.md`](./architecture/4-data-models-and-schema-changes.md) |
| Find API endpoints | [`architecture/6-api-design-and-integration.md`](./architecture/6-api-design-and-integration.md) |
| Implement a feature | [`stories/`](./stories/) (find your epic/story) |
| Review QA status | [`qa/`](./qa/) |
| See UX feedback | [`ux-reviews/`](./ux-reviews/) |
| Understand project structure | [`architecture/8-source-tree.md`](./architecture/8-source-tree.md) |

---

## 📝 Notes

- **Sharded Documents:** Both PRD and Architecture use "markdown explosion" (sharding) for better maintainability
- **Version:** Current documentation is at v4 for both PRD and Architecture
- **Story Location:** All user stories are in `docs/stories/`
- **QA Location:** All QA artifacts are in `docs/qa/`
- **Dev Workflow:** Stories follow a standard template with Tasks, Acceptance Criteria, and Testing sections

---

## 🚀 Current Sprint Focus

**Active Story:** [Story 4.3 - Implement App Navigation & Hamburger Menu](./stories/4.3.implement-app-navigation.md)

**Status:** Ready for Development  
**Epic:** 4 - PWA Rupture & Repair Support Flow  
**Goal:** Add persistent navigation to all authenticated pages with mobile hamburger menu and desktop user menu, including "Need Support" menu item

---

*This index is maintained by the BMAD system and updated with each significant documentation change.*
