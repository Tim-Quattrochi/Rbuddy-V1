# Sprint Plan Update - October 14, 2025

## Executive Summary

**Major Update**: Epic 4 (Rupture & Repair Flow) has been expanded to address a **CRITICAL BLOCKER** identified in Story 4.1. The hardcoded repair suggestions have been replaced with an AI-powered solution (Stories 4.1A and 4.1B).

**Impact**:
- Story 4.1 remains BLOCKED until 4.1A and 4.1B are completed
- Two new stories added to Epic 4
- Estimated additional effort: 5-7 days

---

## Current Sprint Status

### Overall Progress
- **Total Stories**: 15 stories (13 original + 2 new AI stories)
- **Completed**: 10 stories ✅
- **In Progress**: 0 stories
- **Ready for Review**: 1 story (5.1)
- **Blocked**: 1 story (4.1)
- **Draft**: 3 stories (2.1, 4.1A, 4.1B)
- **Completion Rate**: 67% (10/15 stories done)

---

## Epic Breakdown

### ✅ Epic 1: Implement Frontend Google Authentication (100% Complete)
| Story | Status | File | Completion Date |
|-------|--------|------|-----------------|
| 1.1 | ✅ Done | `1.1.update-db-schema-for-oauth.md` | 2025-10-11 |
| 1.2 | ✅ Done | `1.2.implement-backend-oauth-callback.md` | 2025-10-11 |
| 1.3 | ✅ Done | `1.3.build-frontend-login-ui.md` | 2025-10-11 |
| 1.4 | ✅ Done | `1.4.implement-protected-routes-and-logout.md` | 2025-10-11 |
| 1.5 | ✅ Done | `1.5-daily-ritual-pwa-backend.md` | 2025-10-11 |

**Epic Status**: ✅ **COMPLETE**

---

### ⚠️ Epic 2: Deactivate and Defer Twilio Functionality (0% Complete)
| Story | Status | File | Notes |
|-------|--------|------|-------|
| 2.1 | 📋 Draft | `2.1.deactivate-twilio-functionality.md` | Not yet prioritized |

**Epic Status**: 📋 **DEFERRED** (not blocking other work)

**Recommendation**: Deprioritize unless Twilio functionality is causing production issues.

---

### ✅ Epic 3: Implement Daily Ritual Persistence (100% Complete)
| Story | Status | File | Completion Date |
|-------|--------|------|-----------------|
| 3.1 | ✅ Done | `3.1.fix-daily-ritual-persistence.md` | 2025-10-12 |

**Epic Status**: ✅ **COMPLETE**

---

### 🔄 Epic 4: Implement PWA Rupture & Repair Flow (60% Complete → Expanded)
| Story | Status | File | Progress | Notes |
|-------|--------|------|----------|-------|
| 4.1 | ⚠️ **BLOCKED** | `4.1.implement-pwa-rupture-and-repair-flow.md` | 95% (tech complete) | **BLOCKER**: Hardcoded repair suggestions lack therapeutic depth |
| **4.1A** | 📋 **Draft** | `4.1A.ai-powered-repair-suggestions.md` | 0% | **NEW**: AI-powered backend (3-4 days) |
| **4.1B** | 📋 **Draft** | `4.1B.ai-powered-repair-frontend.md` | 0% | **NEW**: AI-powered frontend (2-3 days) |
| 4.2 | ✅ Done | `4.2.improve-repair-flow-accessibility.md` | 100% | 2025-10-12 |
| 4.3 | ✅ Done | `4.3.implement-app-navigation.md` | 100% | 2025-10-12 |

**Epic Status**: 🔄 **IN PROGRESS** (3/5 stories done, 1 blocked, 2 new drafts)

**Critical Path**:
```
Story 4.1 (BLOCKED)
    ↓
Story 4.1A (Backend AI) → 3-4 days
    ↓
Story 4.1B (Frontend AI) → 2-3 days
    ↓
Story 4.1 (UNBLOCKED → Done)
    ↓
Epic 4 Complete ✅
```

**Blocker Details**:
- **Issue**: Hardcoded repair suggestions (e.g., "Drink water and step outside" for cravings) are therapeutically inadequate
- **Identified By**: Product Owner (Tim) on 2025-10-14
- **Impact**: User trust and therapeutic value at risk
- **Solution**: AI-powered contextual responses (Stories 4.1A + 4.1B)
- **Reference**: `docs/REPAIR_FLOW_CONTENT_BLOCKER.md`

**AI Implementation Details**:
- **Provider**: Google Gemini (selected by PO)
- **Approach**: Evidence-based prompt engineering with SAMHSA hotline integration
- **Safety Rails**: Response validation, fallback strategy, rate limiting
- **Expert Review**: Deferred to post-implementation

---

### 🔄 Epic 5: Implement Journaling Feature (67% Complete)
| Story | Status | File | Progress | Notes |
|-------|--------|------|----------|-------|
| 5.1 | 🔍 **Ready for Review** | `5.1.implement-journaling-feature.md` | 95% | 13/16 tests passing (trivial fix needed) |
| 5.2 | ✅ Done | `5.2.view-journal-history.md` | 100% | 2025-10-13 |
| 5.3 | ✅ Done | `5.3.search-and-filter-journal.md` | 100% | 2025-10-14 |

**Epic Status**: 🔄 **NEAR COMPLETE** (2/3 done, 1 needs quick fix)

**Story 5.1 Quick Fix** (5 minutes):
- 3 component tests failing due to ambiguous selector
- Fix: Change `getByLabelText` to `getByRole('textbox')` in 3 locations
- Details: `docs/qa/PENDING_STORIES_REVIEW_SUMMARY.md`

---

## Revised Sprint Timeline

### Current Date: October 14, 2025

### Immediate Priority (This Week)
1. ✅ **Fix Story 5.1** (5 minutes)
   - Update test selectors
   - Run tests to verify
   - Mark as Done

2. 🚀 **Implement Story 4.1A** (3-4 days)
   - Create RepairAIService
   - Integrate Google Gemini
   - Implement safety rails
   - Write comprehensive tests
   - **Estimated Completion**: October 18, 2025

### Next Week (Week of October 21)
3. 🚀 **Implement Story 4.1B** (2-3 days)
   - Enhance loading state
   - Add scrollable container
   - Highlight SAMHSA hotline
   - Update component tests
   - **Estimated Completion**: October 23, 2025

4. ✅ **Unblock Story 4.1**
   - Mark as Done (blocker resolved)
   - Update QA gate to PASS
   - **Completion**: October 23, 2025

### Later (Deprioritized)
5. 📋 **Story 2.1** (Twilio Deactivation)
   - Status: Draft, not blocking other work
   - Effort: 1-2 days when prioritized

---

## Updated Story Count by Status

| Status | Count | Stories |
|--------|-------|---------|
| ✅ Done | 10 | 1.1, 1.2, 1.3, 1.4, 1.5, 3.1, 4.2, 4.3, 5.2, 5.3 |
| 🔍 Ready for Review | 1 | 5.1 (needs 5-min fix) |
| ⚠️ Blocked | 1 | 4.1 (unblocks after 4.1A + 4.1B) |
| 📋 Draft | 3 | 2.1 (deferred), 4.1A (priority), 4.1B (priority) |
| **Total** | **15** | |

---

## Velocity and Burn-Down

### Original Sprint Plan
- **Total Stories**: 13 stories across 5 epics
- **Original Estimate**: 2-3 weeks

### Current Sprint (Updated)
- **Total Stories**: 15 stories (13 original + 2 new)
- **Completed**: 10 stories (67%)
- **Remaining Work**:
  - Story 5.1: 5 minutes
  - Story 4.1A: 3-4 days
  - Story 4.1B: 2-3 days
  - Story 2.1: 1-2 days (deferred)
- **Adjusted Estimate**: Additional 5-7 days for AI implementation

### Burn-Down Chart (Stories)
```
Week 1 (Oct 7-11):  5 stories done (Epic 1) ███████████████░░░░░
Week 2 (Oct 12-14): 5 stories done (Epics 3,4,5) ███████████████░░░░░
Week 3 (Oct 15-18): 2 stories planned (5.1 fix, 4.1A) ████░░░░░░░░░░░░
Week 4 (Oct 21-23): 1 story planned (4.1B) ██░░░░░░░░░░░░░░░░
```

**Velocity**: ~5 stories per week (excellent pace)

---

## Risk Assessment

### 🔴 High Risk
**Story 4.1A (AI Backend)**:
- **Risk**: AI prompt engineering may require multiple iterations
- **Mitigation**: Start with conservative prompt, iterate based on testing
- **Backup Plan**: Use fallback responses if AI quality insufficient

**Expert Consultation**:
- **Risk**: Deferred expert review may identify issues post-implementation
- **Mitigation**: Build with evidence-based techniques (HALT, Urge Surfing)
- **Contingency**: Budget 1-2 days for prompt revisions after expert feedback

### 🟡 Medium Risk
**Story 4.1B (AI Frontend)**:
- **Risk**: UX for 2-5 second loading time needs careful design
- **Mitigation**: Compassionate loading message, spinner animation
- **Testing**: Manual testing on real devices crucial

### 🟢 Low Risk
**Story 5.1 (Journaling Fix)**:
- **Risk**: Minimal - simple test selector change
- **Mitigation**: Already identified exact fix needed

---

## Dependencies and Blockers

### Dependency Chain
```
Epic 1 (Done) ──→ Epic 3 (Done) ──→ Epic 4 (Blocked)
                                         ↓
                                    Story 4.1A
                                         ↓
                                    Story 4.1B
                                         ↓
                                    Story 4.1 (Unblocked)
                                         ↓
                                    Epic 4 Complete
```

### External Dependencies
- ✅ Google Gemini API access (AI_PROVIDER=gemini, GEMINI_API_KEY)
- ⏳ Expert consultation (post-implementation review)
- ✅ Existing AI chat infrastructure (AIChatService)

### No Current Blockers For
- Story 5.1 (ready to fix immediately)
- Story 4.1A (can start after 5.1 fix)

---

## Resource Allocation

### Development Team
| Agent | Current Assignment | Next Assignment |
|-------|-------------------|-----------------|
| James (Dev) | Available | Story 5.1 fix (5 min) → Story 4.1A (3-4 days) |
| Quinn (QA) | Available | Review Story 5.1 → Review Story 4.1A |
| Sally (UX) | Complete | Available for 4.1B UX review |
| Bob (SM) | Sprint planning | Monitor 4.1A/4.1B progress |
| John (PM) | Available | Schedule expert consultation post-4.1B |

---

## Definition of Done Updates

### Story 4.1 (Original)
**Was**: Technical implementation complete (16/16 tests)  
**Now**: Technical implementation + 4.1A + 4.1B complete  
**Reason**: Blocker identified - hardcoded content inadequate

### Story 4.1A (New)
- [ ] RepairAIService class created and tested
- [ ] Google Gemini integration functional
- [ ] System prompt includes evidence-based techniques
- [ ] Response validation (SAMHSA hotline presence)
- [ ] Fallback strategy implemented
- [ ] Rate limiting configured
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Code reviewed and approved

### Story 4.1B (New)
- [ ] Loading state enhanced (spinner + message)
- [ ] Scrollable container for long responses
- [ ] SAMHSA hotline highlighted with click-to-call
- [ ] All component tests passing
- [ ] Mobile responsive verified
- [ ] Accessibility validated
- [ ] Code reviewed and approved

---

## Communication Plan

### Stakeholder Updates
- **Product Owner (Tim)**: Daily standup, decisions on AI prompt iterations
- **Development Team**: Daily check-ins during 4.1A/4.1B implementation
- **Expert Consultant**: Schedule review after 4.1B complete (~Oct 24)

### Status Reporting
- **Daily**: Quick status updates on 4.1A/4.1B progress
- **Weekly**: Sprint burn-down and velocity metrics
- **Completion**: Full retrospective after Epic 4 complete

---

## Success Criteria

### Sprint Success
- ✅ Epic 1 complete (Done)
- ✅ Epic 3 complete (Done)
- ✅ Epic 5 complete (Story 5.1 needs 5-min fix)
- 🎯 Epic 4 complete (Stories 4.1A + 4.1B in progress)
- 📋 Epic 2 deferred (acceptable)

### Quality Gates
- All tests passing (unit, integration, component)
- QA review approved for each story
- Expert consultation validates AI prompts (post-implementation)
- No regressions in existing features

### User Impact
- Users receive personalized, evidence-based repair suggestions
- SAMHSA hotline always accessible
- Seamless experience whether AI succeeds or fallback used
- Therapeutic value significantly improved vs. hardcoded suggestions

---

## Next Actions (Priority Order)

1. **Immediate** (Today/Tomorrow):
   - [ ] Fix Story 5.1 test selectors (5 minutes)
   - [ ] Run tests to verify fix
   - [ ] Mark Story 5.1 as Done
   - [ ] Update Epic 5 to Complete

2. **This Week** (Oct 15-18):
   - [ ] Dev agent (James) implements Story 4.1A
   - [ ] QA agent (Quinn) reviews Story 4.1A implementation
   - [ ] Test AI responses with various trigger scenarios
   - [ ] Validate fallback logic

3. **Next Week** (Oct 21-23):
   - [ ] Dev agent (James) implements Story 4.1B
   - [ ] QA agent (Quinn) reviews Story 4.1B implementation
   - [ ] Manual UX testing on mobile devices
   - [ ] Mark Story 4.1 as Done (blocker resolved)
   - [ ] Mark Epic 4 as Complete

4. **Following Week** (Oct 24+):
   - [ ] Schedule expert consultation (addiction recovery specialist)
   - [ ] Review AI prompts with expert
   - [ ] Iterate on prompt if needed (budget 1-2 days)
   - [ ] Sprint retrospective

---

## Retrospective Notes (To Review)

### What Went Well
- ✅ Excellent velocity (10 stories in 2 weeks)
- ✅ Proactive blocker identification (PO caught inadequate content)
- ✅ Quick pivot to AI solution (Stories 4.1A/4.1B drafted same day)
- ✅ Strong test coverage across all stories

### What to Improve
- ⚠️ Initial repair flow content not validated with recovery expert
- ⚠️ Could have identified therapeutic concerns earlier in planning
- 💡 Consider upfront expert consultation for sensitive features

### Lessons Learned
- 🎓 Therapeutic/clinical features require domain expert validation
- 🎓 AI can address content quality issues if infrastructure exists
- 🎓 Breaking blocked stories into sub-stories (4.1A, 4.1B) clarifies work
- 🎓 Transparent blocker documentation (`REPAIR_FLOW_CONTENT_BLOCKER.md`) helps team alignment

---

## Appendix: Story File References

### Epic 4 Stories (Full List)
- `docs/stories/4.1.implement-pwa-rupture-and-repair-flow.md` (BLOCKED)
- `docs/stories/4.1A.ai-powered-repair-suggestions.md` (Draft - Backend)
- `docs/stories/4.1B.ai-powered-repair-frontend.md` (Draft - Frontend)
- `docs/stories/4.2.improve-repair-flow-accessibility.md` (Done)
- `docs/stories/4.3.implement-app-navigation.md` (Done)

### Supporting Documentation
- `docs/REPAIR_FLOW_CONTENT_BLOCKER.md` - Blocker analysis with 3 solution options
- `docs/qa/gates/4.1-implement-pwa-rupture-and-repair-flow.yml` - QA gate (BLOCKED)
- `docs/qa/PENDING_STORIES_REVIEW_SUMMARY.md` - Story 5.1 fix instructions
- `docs/ai-chat.md` - Existing AI chat infrastructure documentation

---

**Sprint Plan Updated By**: Bob (Scrum Master)  
**Date**: October 14, 2025  
**Next Review**: October 18, 2025 (after Story 4.1A complete)
