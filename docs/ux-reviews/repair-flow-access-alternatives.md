# Repair Flow Access: UX Alternative Designs

**Date:** October 12, 2025  
**Reviewer:** Sally (UX Expert)  
**Story:** 4.1 - Implement PWA Rupture & Repair Flow  
**Status:** Under Review  

---

## Executive Summary

The current implementation (Story 4.1) places an "I slipped" button in the persistent header navigation. While this ensures accessibility, it may create **emotional safety concerns** that contradict the app's core trauma-informed design principles.

This document presents **five alternative designs** with detailed UX analysis, implementation complexity, and recommendations.

**Recommendation:** Hybrid Approach (Option 5) - Contextual trigger with dashboard widget fallback.

---

## Current Implementation Analysis

### What's Currently Implemented

```
┌─────────────────────────────────────┐
│  ❤️ Next Moment  [I slipped]  👤 │  ← Header (persistent)
├─────────────────────────────────────┤
│                                     │
│        Daily Ritual Content         │
│                                     │
└─────────────────────────────────────┘
```

**Location:** Header component (`client/src/components/Header.tsx`)  
**Visibility:** Always visible when authenticated  
**Interaction:** Click opens full-screen modal with repair flow

### UX Concerns Identified

#### 1. Emotional Anxiety
- **Issue:** Constant visibility serves as a reminder of potential failure
- **User Impact:** May trigger shame or anxiety every time user opens the app
- **Trauma-Informed Lens:** Recovery apps should reinforce progress, not anticipate relapse

#### 2. Cognitive Load
- **Issue:** Header real estate is prime for navigation and core functionality
- **User Impact:** "I slipped" competes for attention with primary tasks
- **Mental Model:** Users may perceive app as "waiting for them to fail"

#### 3. Tone Mismatch
- **Issue:** Casual button placement doesn't match the gravity of the moment
- **User Impact:** When someone is in crisis, prominent button feels exposed/public
- **Privacy Concern:** Visible button may deter use if someone glances at screen

#### 4. Feature Discoverability vs. Prominence
- **Trade-off:** Making feature easily accessible vs. making it emotionally safe
- **Current State:** Prioritizes accessibility over emotional safety
- **Recovery Context:** Users in crisis will seek help; don't need constant reminder

---

## Alternative Design Options

### Option 1: Floating Action Button (FAB)

#### Visual Design

```
┌─────────────────────────────────────┐
│  ❤️ Next Moment             👤   │  ← Clean header
├─────────────────────────────────────┤
│                                     │
│        Daily Ritual Content         │
│                                     │
│                                     │
│                            ┌──────┐ │
│                            │  🆘  │ │  ← FAB (bottom-right)
│                            └──────┘ │
└─────────────────────────────────────┘
```

#### Implementation Details

**Component:** New `SupportFAB.tsx` component  
**Position:** Fixed, bottom-right corner (16px from bottom, 16px from right)  
**Size:** 56×56px circular button (meets WCAG touch target)  
**Icon:** Lifebuoy (🆘) or `LifeBuoy` from Lucide React  
**Color:** Soft purple (#9333EA) - distinct from primary actions  
**Interaction:**
- Hover: Expands to show "Need Support?" text
- Click: Opens repair modal
- Long-press (mobile): Shows tooltip

**Code Snippet:**
```tsx
// client/src/components/support/SupportFAB.tsx
export function SupportFAB() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:w-auto hover:px-4 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Need support"
    >
      <LifeBuoy className="h-6 w-6" />
      {isHovered && <span className="ml-2">Need Support?</span>}
    </button>
  );
}
```

#### UX Analysis

**Strengths:**
- ✅ Always accessible without being prominent
- ✅ Less cognitive load (peripheral vision placement)
- ✅ Mobile-friendly (thumb-reachable zone)
- ✅ Familiar pattern (common in apps like WhatsApp, Gmail)
- ✅ Can expand on hover to reveal text

**Weaknesses:**
- ❌ May block content in bottom-right corner
- ❌ Still visible on every screen (less prominent but present)
- ❌ Can interfere with scrolling on mobile
- ❌ Accessibility: May be hard to discover for screen reader users

**Accessibility Notes:**
- Add `aria-label="Need support - Opens repair flow"`
- Ensure keyboard focus with Tab key
- Use `role="button"` explicitly
- Consider `aria-live="polite"` announcement on first app open

**Recommendation:** ⭐⭐⭐ Good balance of accessibility and subtlety

---

### Option 2: Dashboard Widget / Support Card

#### Visual Design

```
┌─────────────────────────────────────┐
│  ❤️ Next Moment             👤   │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │   🔥 12-Day Streak            │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   💙 Need Support?            │ │  ← Support widget
│  │                               │ │
│  │   Tough moments happen. We're │ │
│  │   here to help.               │ │
│  │                               │ │
│  │   [Access Support]            │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Today's Check-In            │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### Implementation Details

**Component:** New `SupportWidget.tsx` component  
**Location:** Dashboard page (`client/src/pages/Dashboard.tsx`)  
**Position:** Below streak counter, above check-in button  
**Size:** Full-width card with gentle purple background  
**Interaction:**
- Static card, always visible on dashboard
- Button click opens repair modal
- Collapsible option (user can minimize if desired)

**Code Snippet:**
```tsx
// client/src/components/dashboard/SupportWidget.tsx
export function SupportWidget({ onOpenRepair }: { onOpenRepair: () => void }) {
  return (
    <Card className="bg-purple-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Heart className="h-5 w-5" />
          Need Support?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-purple-800 mb-4">
          Tough moments happen. We're here to help, anytime.
        </p>
        <Button 
          onClick={onOpenRepair}
          variant="outline"
          className="border-purple-300 text-purple-700 hover:bg-purple-100"
        >
          Access Support
        </Button>
      </CardContent>
    </Card>
  );
}
```

#### UX Analysis

**Strengths:**
- ✅ Normalizes seeking support (integrated into daily routine)
- ✅ No visual clutter on header
- ✅ Supportive messaging builds trust
- ✅ Excellent accessibility (large touch target, clear text)
- ✅ Can include crisis hotline (988) as secondary link

**Weaknesses:**
- ❌ Only visible on dashboard (not accessible from other pages)
- ❌ User must navigate back to dashboard to access
- ❌ May be ignored if user avoids dashboard during crisis
- ❌ Requires scrolling if user has multiple widgets

**Accessibility Notes:**
- Semantically structured card with proper heading hierarchy
- High contrast text on purple background
- Clear button text (no icon-only)
- Can be announced by screen reader on page load

**Recommendation:** ⭐⭐⭐⭐ Excellent for normalizing support, but needs secondary access point

---

### Option 3: Contextual Trigger (Behavior-Based)

#### Concept

Instead of a persistent button, the app **proactively offers support** based on user behavior patterns:

**Triggers:**
1. User misses 2+ consecutive check-ins
2. User reports "Struggling" (mood 1) for 3+ days in a row
3. User has no check-in activity for 5+ days
4. User's journal entries contain crisis keywords (future)

#### Visual Design (Triggered State)

```
┌─────────────────────────────────────┐
│  ❤️ Next Moment             👤   │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐ │
│  │ 💙 We noticed you've been     │ │  ← Gentle prompt
│  │    away for a few days.       │ │
│  │                               │ │
│  │    Everything okay? Would you │ │
│  │    like to talk?              │ │
│  │                               │ │
│  │    [I'm okay]  [I need help]  │ │
│  └───────────────────────────────┘ │
│                                     │
│        Daily Ritual Content         │
│                                     │
└─────────────────────────────────────┘
```

#### Implementation Details

**Component:** `ContextualSupportPrompt.tsx`  
**Logic Location:** `client/src/hooks/useSupportTrigger.ts`  
**Trigger Detection:** Backend API analyzes user session/mood data  
**Display:** Toast notification or banner at top of page  
**Frequency:** Maximum once per 48 hours to avoid fatigue

**Code Snippet:**
```tsx
// client/src/hooks/useSupportTrigger.ts
export function useSupportTrigger() {
  const { data: trigger } = useQuery(['supportTrigger'], async () => {
    const response = await fetch('/api/user/support-trigger');
    return response.json();
  }, {
    refetchInterval: 60000, // Check every minute
  });
  
  return {
    shouldShowPrompt: trigger?.shouldShow,
    reason: trigger?.reason,
    message: trigger?.message,
  };
}
```

#### UX Analysis

**Strengths:**
- ✅ **Highest emotional safety:** No constant reminder of potential slip
- ✅ Proactive support feels caring, not judgmental
- ✅ User doesn't need to self-identify crisis
- ✅ Data-informed (leverages existing mood/session data)
- ✅ Can be gentle nudge ("We miss you") vs. crisis intervention

**Weaknesses:**
- ❌ **No manual access:** User can't trigger repair flow on demand
- ❌ Complex logic required (must tune trigger thresholds)
- ❌ May miss users who slip suddenly (no behavioral pattern)
- ❌ Requires robust backend analytics
- ❌ Privacy concern: "App is watching me"

**Accessibility Notes:**
- Prompt uses `aria-live="polite"` for screen reader announcement
- High contrast for visibility
- Keyboard accessible (Tab to buttons)
- Clear, simple language

**Recommendation:** ⭐⭐⭐ Excellent concept but **must be paired with manual access option**

---

### Option 4: Help Menu with Support Option

#### Visual Design

```
┌─────────────────────────────────────┐
│  ❤️ Next Moment        [☰]   👤  │  ← Menu button
├─────────────────────────────────────┤
│                                     │
│        Daily Ritual Content         │
│                                     │
└─────────────────────────────────────┘

[User clicks ☰ menu button]

┌─────────────────────────────────────┐
│  ❤️ Next Moment        [☰]   👤  │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ ☰ Menu                      │   │
│  ├─────────────────────────────┤   │
│  │ 🏠 Dashboard                │   │
│  │ 📖 Journal                  │   │
│  │ 📊 My Progress              │   │
│  │ ────────────────────────    │   │
│  │ 💙 Need Support             │   │  ← Support option
│  │ 📞 Crisis Resources         │   │
│  │ ────────────────────────    │   │
│  │ ⚙️ Settings                 │   │
│  │ 🚪 Logout                   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Implementation Details

**Component:** Update existing `Header.tsx` to add hamburger menu  
**Menu Component:** `NavigationMenu.tsx` (new)  
**Location:** Slides in from right (mobile) or dropdown (desktop)  
**Support Section:** Dedicated section with "Need Support" + "Crisis Resources"

**Code Snippet:**
```tsx
// client/src/components/NavigationMenu.tsx
export function NavigationMenu({ onClose, onOpenRepair }: Props) {
  return (
    <Sheet>
      <SheetContent side="right">
        <nav className="flex flex-col gap-4">
          <Link to="/dashboard">🏠 Dashboard</Link>
          <Link to="/journal">📖 Journal</Link>
          <Link to="/progress">📊 My Progress</Link>
          
          <Separator />
          
          <button onClick={onOpenRepair} className="text-left text-purple-600">
            💙 Need Support
          </button>
          <Link to="/resources" className="text-purple-600">
            📞 Crisis Resources
          </Link>
          
          <Separator />
          
          <Link to="/settings">⚙️ Settings</Link>
          <button onClick={logout}>🚪 Logout</button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
```

#### UX Analysis

**Strengths:**
- ✅ Removes clutter from header
- ✅ Groups support with other resources (crisis hotline)
- ✅ Familiar pattern (hamburger menu)
- ✅ Accessible via single tap/click
- ✅ Can include additional resources (FAQs, community)

**Weaknesses:**
- ❌ Requires two actions (open menu, then select)
- ❌ "Out of sight, out of mind" - low discoverability
- ❌ Users in crisis may not think to check menu
- ❌ Extra cognitive load during high-stress moment

**Accessibility Notes:**
- Proper semantic navigation (`<nav>`)
- Keyboard accessible (Tab, Arrow keys)
- Screen reader announces menu state (open/closed)
- Focus trap when menu is open

**Recommendation:** ⭐⭐ Reduces header clutter but adds friction in crisis

---

### Option 5: Hybrid Approach (Recommended)

#### Concept

Combine multiple approaches for optimal balance:

1. **Primary Access:** Contextual trigger (behavior-based prompt)
2. **Secondary Access:** Dashboard support widget (always available)
3. **Tertiary Access:** Help menu option (backup for users who prefer menus)

**User Journey:**

```
┌─────────────────────────────────────┐
│  App detects missed check-ins       │
│         ↓                            │
│  Shows gentle prompt on next visit  │
│  "We've missed you. Everything ok?" │
│         ↓                            │
│  User can engage or dismiss         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  User experiencing sudden crisis    │
│         ↓                            │
│  Navigates to dashboard             │
│         ↓                            │
│  Sees "Need Support?" widget        │
│         ↓                            │
│  Clicks to open repair flow         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  User prefers menu navigation       │
│         ↓                            │
│  Opens hamburger menu               │
│         ↓                            │
│  Selects "Need Support"             │
│         ↓                            │
│  Opens repair flow                  │
└─────────────────────────────────────┘
```

#### Implementation Phases

**Phase 1 (Immediate):**
- Remove "I slipped" button from header
- Add support widget to dashboard
- Add "Need Support" to menu

**Phase 2 (Next Sprint):**
- Implement contextual trigger logic
- Add analytics tracking for trigger accuracy
- Tune trigger thresholds based on usage data

#### UX Analysis

**Strengths:**
- ✅ **Best emotional safety:** No constant reminder
- ✅ **High accessibility:** Multiple paths to support
- ✅ **Proactive care:** App reaches out when needed
- ✅ **User autonomy:** Can also self-initiate support
- ✅ **Data-informed:** Uses behavioral patterns
- ✅ **Progressive enhancement:** Works without contextual logic

**Weaknesses:**
- ❌ Most complex to implement (3 separate features)
- ❌ Requires careful testing to avoid over-prompting
- ❌ Backend logic for triggers adds technical debt

**Accessibility Notes:**
- All three access points are keyboard accessible
- Contextual prompt uses `aria-live` for announcements
- Dashboard widget has semantic structure
- Menu option follows standard navigation patterns

**Recommendation:** ⭐⭐⭐⭐⭐ **Best overall solution** - balances all concerns

---

## Implementation Complexity Comparison

| Option | Dev Effort | Backend Changes | Testing Effort | Risk |
|--------|-----------|-----------------|----------------|------|
| **Option 1: FAB** | Low (4 hours) | None | Low | Low |
| **Option 2: Dashboard Widget** | Low (3 hours) | None | Low | Low |
| **Option 3: Contextual Trigger** | High (16 hours) | New API endpoint + analytics | High | Medium |
| **Option 4: Help Menu** | Medium (8 hours) | None | Medium | Low |
| **Option 5: Hybrid** | High (24 hours) | New API endpoint + analytics | High | Medium |

---

## User Testing Recommendations

Before finalizing the design, conduct **rapid usability testing** with 3-5 users:

### Test Scenarios

1. **Crisis Scenario:** "You've been struggling this week. How would you access support?"
2. **Exploration:** "Explore the app for 2 minutes. What support options do you notice?"
3. **Discoverability:** "If you needed help, where would you look?"

### Key Metrics

- Time to find support option
- Number of users who find it without prompting
- Emotional response to each design (anxiety vs. comfort)
- Preference ranking (forced choice between options)

### Testing Script

```
"Imagine you're using Next Moment and you've had a really tough day. 
You're thinking about using substances again. 
Without me telling you where to look, show me how you would get help in this app."

[Observe: Do they find the support feature? How long does it take? 
Do they seem comfortable accessing it?]
```

---

## Recommendation Summary

**Immediate Action (Story 4.1 Completion):**
1. **Remove** "I slipped" button from header
2. **Add** support widget to dashboard (Option 2)
3. **Add** "Need Support" to hamburger menu (Option 4)

**Next Sprint (Story 4.2):**
4. **Implement** contextual trigger logic (Option 3)
5. **Test** hybrid approach with pilot users
6. **Iterate** based on real-world usage data

**Rationale:**
- Option 5 (Hybrid) provides best UX but requires time to build
- Options 2 + 4 can be implemented immediately with minimal risk
- Contextual triggers can be added incrementally without breaking existing features
- User testing will validate the approach before full rollout

---

## Open Questions for Product Owner

1. **Crisis Escalation:** Should the app detect crisis language in journal entries and proactively offer support?
2. **Frequency Limits:** How often should contextual prompts appear? (Current proposal: Max 1 per 48 hours)
3. **Privacy Tradeoff:** Are users comfortable with app analyzing their behavior to trigger support?
4. **Milestone Integration:** Should repair flow also be accessible from streak milestones? (e.g., "Protect your progress")
5. **Crisis Hotline Prominence:** Should 988 crisis line be in footer of every page, or only in repair flow?

---

## Appendix: Design System Notes

### New Components Required

**For Option 1 (FAB):**
- `SupportFAB.tsx` - Floating action button component
- Uses existing Button primitive from shadcn/ui

**For Option 2 (Widget):**
- `SupportWidget.tsx` - Dashboard card component
- Uses existing Card, CardHeader, CardContent from shadcn/ui

**For Option 3 (Contextual):**
- `ContextualSupportPrompt.tsx` - Banner component
- `useSupportTrigger.ts` - Custom hook for trigger logic
- Backend: `/api/user/support-trigger` endpoint

**For Option 4 (Menu):**
- `NavigationMenu.tsx` - Slide-out menu component
- Uses Sheet from shadcn/ui (already installed)

### Color Palette Updates

**New Color:** Support Purple (distinct from primary)
- Hex: `#9333EA` (purple-600)
- Usage: Support features, repair flow, help resources
- Rationale: Differentiate support from primary actions (blue)

### Typography Updates

**New Text Style:** Supportive Messaging
- Font size: 14px (text-sm)
- Weight: 400 (normal)
- Line height: 1.6 (relaxed)
- Color: Purple-800 for light backgrounds
- Usage: All support-related messaging

---

## Change Log

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2025-10-12 | 1.0 | Initial UX review and alternative designs | Sally (UX Expert) |

---

**Next Steps:**
1. Product Owner reviews alternatives
2. Decision logged in Story 4.1
3. Implementation plan created for chosen design(s)
4. User testing scheduled (optional but recommended)

