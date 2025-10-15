# BLOCKER: Repair Flow Content Validation Required

**Date Identified**: October 14, 2025  
**Identified By**: Product Owner / Tim  
**Story Blocked**: 4.1 - Implement PWA Rupture & Repair Flow  
**Severity**: HIGH - Blocks production deployment

---

## Issue Description

The hardcoded repair suggestions in the Rupture & Repair flow are **therapeutically insufficient** and may undermine the feature's value and user trust.

### Current Implementation

```typescript
// Location: server/services/conversationEngine.ts
const REPAIR_SUGGESTIONS = {
  "stress": "Take 3 deep breaths right now.",
  "people": "Text or call someone who supports your recovery.",
  "craving": "Drink a glass of water and step outside."
}
```

### Specific Concerns

#### 1. **Craving Response is Trivial**
**Current**: "Drink a glass of water and step outside."

**Problem**: 
- Grossly underestimates the intensity of addiction cravings
- Feels dismissive to someone in genuine crisis
- May cause user to lose trust in the app ("They don't understand my struggle")
- Not evidence-based harm reduction

**What's Missing**:
- Acknowledgment of craving intensity
- Time-tested crisis management techniques
- Connection to emergency resources
- Urge surfing / delay tactics
- Support hotline information

#### 2. **Stress Response is Generic**
**Current**: "Take 3 deep breaths right now."

**Problem**:
- Too generic (could apply to any stress, not recovery-specific)
- Doesn't acknowledge relapse triggers vs. general stress
- No connection to recovery-specific coping mechanisms

#### 3. **People Response Assumes Support Network**
**Current**: "Text or call someone who supports your recovery."

**Problem**:
- Assumes user has built support network
- No guidance if user is isolated
- Doesn't provide backup options

---

## Questions That Need Answers

### 1. Clinical/Therapeutic Validation
- [ ] **Do we have clinical expertise advising this feature?**
- [ ] **Are these suggestions evidence-based?** (SAMHSA guidelines, etc.)
- [ ] **What liability exists for giving crisis advice?**

### 2. Product Strategy
- [ ] **What's the primary goal of the repair flow?**
  - Crisis intervention? (High risk)
  - Emotional support? (Lower risk)
  - Connection to resources? (Safest)
  - Journaling/reflection? (Safest)

- [ ] **Should we be giving advice at all?**
  - Alternative: Compassionate listening + resource connection
  - Alternative: Reflective journaling prompts
  - Alternative: Immediate connection to crisis lines

### 3. User Research
- [ ] **Have we tested these suggestions with actual users in recovery?**
- [ ] **What do recovery experts recommend for each trigger?**
- [ ] **What are evidence-based responses to cravings?**

---

## Potential Solutions

### Option A: Evidence-Based Content Research (Recommended)
**Effort**: 2-5 days (including expert consultation)
**Risk**: Low (but blocks deployment)

**Actions**:
1. Consult with addiction counselor / recovery specialist
2. Review SAMHSA harm reduction guidelines
3. Research evidence-based crisis interventions
4. Draft revised suggestions with clinical validation
5. Consider multi-level responses based on intensity

**Example Improved Content (Draft - Needs Validation)**:
```typescript
REPAIR_SUGGESTIONS = {
  "craving": {
    immediate: "This craving will pass. Right now, use the HALT technique: Are you Hungry, Angry, Lonely, or Tired? Address the root cause.",
    delay: "Delay acting on this urge for 15 minutes. Cravings peak and pass in waves.",
    resources: "Call SAMHSA National Helpline: 1-800-662-4357 (24/7, free, confidential)"
  },
  "stress": {
    immediate: "Acknowledge this stress without judgment. Name 5 things you can see, 4 you can hear, 3 you can touch.",
    reframe: "Stress is a sign you care about your recovery. That's strength, not weakness.",
    resources: "Connect with your sponsor or call Crisis Text Line: Text HOME to 741741"
  },
  "people": {
    immediate: "People triggers are real. You can protect your recovery by setting boundaries.",
    action: "If you have a recovery contact, reach out now. If not, call SAMHSA: 1-800-662-4357",
    resources: "Consider joining a support group (AA, NA, SMART Recovery, etc.)"
  }
}
```

### Option B: Defer Advice, Focus on Connection
**Effort**: 1 day (low risk modification)
**Risk**: Lower (removes liability of giving advice)

**Strategy**: 
- Acknowledge the trigger compassionately
- Provide **connection to resources** (hotlines, support groups)
- Offer journaling prompt for reflection
- Remove specific "advice" that could be wrong

**Example**:
```typescript
REPAIR_SUGGESTIONS = {
  "craving": {
    message: "Cravings are hard, but they pass. You're not alone in this.",
    resources: [
      "SAMHSA National Helpline: 1-800-662-4357 (24/7, free)",
      "Crisis Text Line: Text HOME to 741741"
    ],
    journalPrompt: "What does this craving feel like right now? Write about it without judgment."
  }
}
```

### Option C: AI-Powered Contextual Response
**Effort**: 2-3 weeks (requires AI integration)
**Risk**: Medium (requires careful prompt engineering + safety rails)

**Strategy**:
- Use AI chat widget (already implemented) in repair flow
- Provide context: user is experiencing [trigger], needs compassionate support
- Safety rails: AI trained on harm reduction, never minimizes, always offers resources
- Fallback to human resources

---

## Recommended Decision Path

### Step 1: Immediate (Today)
**Block Story 4.1 deployment** until content is validated.

**Update Story 4.1 status**:
```yaml
Status: Blocked
Blocker: Repair flow content requires clinical validation
Action: Consult with recovery specialist to validate suggestions
Estimated Resolution: 2-5 days
```

### Step 2: This Week
**Consult with addiction recovery expert** (therapist, counselor, SAMHSA resources)

Questions to ask:
1. What are evidence-based responses to cravings?
2. What harm reduction strategies should we recommend?
3. What should we NEVER say to someone experiencing a trigger?
4. Should we give advice at all, or just connect to resources?

### Step 3: Next Week
**Implement validated content** based on expert guidance

Options:
- Revised hardcoded suggestions (if expert approves this approach)
- Connection-first approach (resources over advice)
- Hybrid approach (acknowledgment + resources + optional journaling)

---

## Impact Assessment

### If We Deploy Current Content
**Risks**:
- ❌ User feels dismissed during crisis ("They think water will help my craving?!")
- ❌ Loss of trust in app ("This app doesn't understand addiction")
- ❌ Potential harm if user follows inadequate advice
- ❌ Liability concerns if we're giving clinical-level advice without expertise

### If We Validate Content First
**Benefits**:
- ✅ Evidence-based, clinically sound advice
- ✅ User feels understood and supported
- ✅ Builds trust in app as recovery tool
- ✅ Reduced liability (expert-validated content)

**Costs**:
- ⏱️ 2-5 day delay in Story 4.1 completion
- 💰 Possible consultation fees for expert review

---

## Recommended Next Steps

1. **Today**: Update Story 4.1 status to "Blocked - Content Validation Required"
2. **This Week**: 
   - Reach out to recovery specialist / addiction counselor
   - Research SAMHSA harm reduction guidelines
   - Review evidence-based crisis intervention literature
3. **Next Week**: 
   - Revise content based on expert guidance
   - Update ConversationEngine implementation
   - Add content source citations to code comments
   - Update tests with revised content

---

## Resources to Consult

### Clinical Guidelines
- SAMHSA (Substance Abuse and Mental Health Services Administration)
- National Institute on Drug Abuse (NIDA)
- Evidence-Based Practices Resource Center

### Potential Expert Contacts
- Local addiction counselors (LADC, CADC certifications)
- Recovery coaches
- Medical professionals specializing in addiction medicine

### Evidence-Based Techniques to Research
- **Urge Surfing** (mindfulness-based craving management)
- **HALT** (Hungry, Angry, Lonely, Tired - addressing root causes)
- **Delay and Distract** (time-tested crisis management)
- **Grounding Techniques** (5-4-3-2-1 sensory awareness)
- **SMART Recovery** 4-Point Program
- **Harm Reduction** principles

---

## Decision Log

| Date | Decision | Rationale | Owner |
|------|----------|-----------|-------|
| 2025-10-14 | Blocked Story 4.1 for content validation | Current suggestions lack therapeutic depth and may harm user trust | Tim (PO) |
| TBD | [Pending expert consultation] | | |

---

**Created**: October 14, 2025  
**Last Updated**: October 14, 2025  
**Owner**: Product Owner (Tim)  
**Status**: ACTIVE BLOCKER
