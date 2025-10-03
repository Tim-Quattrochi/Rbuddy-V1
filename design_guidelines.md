# Reentry Buddy Design Guidelines

## Design Approach: Wellness-Focused Design System

**Selected Approach**: Health & Wellness Design System with emphasis on accessibility, trust, and emotional support for users in recovery.

**Rationale**: Recovery applications require stability, clarity, and calming aesthetics. This approach prioritizes user emotional safety, reduces cognitive load, and builds trust through consistent, supportive design patterns.

**Key Principles**:
- Emotional safety through calming color palettes
- Clarity and simplicity to reduce decision fatigue
- Accessibility-first for diverse user needs
- Trust-building through professional, stable design

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Primary: 210 80% 45% (Calm Blue - trust, stability)
- Primary Hover: 210 80% 40%
- Secondary: 150 60% 45% (Growth Green - hope, renewal)
- Background: 0 0% 98% (Soft White)
- Surface: 0 0% 100% (Pure White)
- Text Primary: 220 20% 20% (Dark Gray)
- Text Secondary: 220 15% 45% (Medium Gray)
- Border: 220 15% 88%

**Dark Mode**:
- Primary: 210 70% 55%
- Primary Hover: 210 70% 60%
- Secondary: 150 50% 55%
- Background: 220 20% 12%
- Surface: 220 18% 16%
- Text Primary: 0 0% 95%
- Text Secondary: 220 10% 70%
- Border: 220 12% 25%

**Accent Colors** (Use sparingly):
- Success: 150 65% 45% (Achievement moments)
- Calm Purple: 260 40% 55% (Meditation/reflection states)

### B. Typography

**Font Stack**: 
- Primary: 'Inter' (Google Fonts) - Clean, highly legible for all content
- Headings: 'Inter' Semi-bold (600) and Bold (700)

**Type Scale**:
- Hero Heading: text-4xl md:text-5xl font-bold
- Page Heading: text-3xl font-bold
- Section Heading: text-2xl font-semibold
- Subheading: text-lg font-medium
- Body: text-base
- Small: text-sm
- Input Labels: text-sm font-medium

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 (p-2, m-4, gap-6, py-8, px-12, etc.)

**Container System**:
- Max width for content: max-w-md (mobile-first, 448px)
- Landing page sections: max-w-6xl for desktop expansion
- Consistent padding: px-4 md:px-6 for page edges
- Section spacing: py-12 md:py-20 for landing page

**Grid System**:
- Mobile: Single column (grid-cols-1)
- Desktop landing: 2-column for features (md:grid-cols-2)

### D. Component Library

**Navigation Header**:
- Height: h-16
- Background: backdrop-blur with surface color
- Logo placement: Left-aligned with icon + text
- Sticky positioning for accessibility

**Buttons**:
- Primary CTA: bg-primary text-white, rounded-lg, px-6 py-3, text-lg font-semibold
- Secondary: border-2 border-primary text-primary, same dimensions
- Form submit: Full width on mobile (w-full sm:w-auto)
- Hover states: Subtle brightness shift, no dramatic transforms

**Form Elements**:
- Input fields: border-2 rounded-lg, px-4 py-3, text-base
- Text area: min-h-32 for journaling box
- Labels: Above inputs, font-medium, mb-2
- Focus states: Ring-2 ring-primary ring-offset-2
- Dark mode: Proper input background (surface color)

**Cards**:
- Background: surface color
- Border: 1px solid border color
- Rounded: rounded-xl
- Padding: p-6
- Shadow: shadow-sm, hover:shadow-md transition

**Icons**:
- Library: Heroicons (outline style for consistency)
- Size: w-6 h-6 for standard icons, w-12 h-12 for feature icons
- Recovery-themed: Heart (wellness), CheckCircle (achievement), Sun (new day), Book (journaling), Target (goals)

### E. Page-Specific Layouts

**Landing Page Structure**:
1. **Hero Section**: py-16 md:py-24, centered content, max-w-4xl
   - Large headline with value proposition
   - Supporting subtext (text-lg text-secondary)
   - Primary CTA button
   - Optional: Small trust indicator (e.g., "Supporting recovery journeys")

2. **Features Section**: py-12 md:py-20, grid-cols-1 md:grid-cols-2 gap-8
   - Feature cards with icons, headings, descriptions
   - Icons: Daily check-ins (Calendar), Goal setting (Target), Journaling (Book), Support (Heart)

3. **Footer**: py-8, border-t, text-sm text-secondary
   - Simple copyright and support resources link

**Check-In Page Layout**:
- Centered card design: max-w-md mx-auto
- Large "Check-In for Today" button: w-full, py-4, text-xl
- Form reveals below button with smooth transition
- Form spacing: space-y-6 between fields
- Submit button: Prominent, full-width on mobile

## Images

**Hero Image**: Not recommended for this application. The emotional weight of recovery requires immediate clarity of purpose without visual distractions. Use a solid gradient background (from primary to secondary) or subtle pattern instead.

**Feature Icons**: Use illustrative icons from Heroicons rather than photos to maintain focus and reduce emotional complexity.

## Animations

**Minimal Approach**:
- Form reveal: Simple opacity and translate-y transition (300ms ease)
- Button hovers: Subtle brightness shift only
- Page transitions: Fade between routes (200ms)
- No decorative animations that could distract from recovery focus

## Accessibility & Trust Features

- High contrast ratios (WCAG AA minimum)
- Clear focus indicators on all interactive elements
- Large touch targets (min 44x44px)
- Calm, non-triggering color choices
- Consistent dark mode throughout (no jarring white inputs in dark UI)
- Clear, supportive microcopy throughout