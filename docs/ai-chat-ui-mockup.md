# Floating AI Chat - UI Mockup

## Desktop View (1024px+)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Daily Ritual Page                                                      │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │                     Daily Ritual                            │        │
│  │              Your space for daily reflection                │        │
│  │                                                             │        │
│  │  ┌──────────────────────────────────────────────────┐      │        │
│  │  │         Streak Counter: 7 Days 🔥                │      │        │
│  │  └──────────────────────────────────────────────────┘      │        │
│  │                                                             │        │
│  │  ┌──────────────────────────────────────────────────┐      │        │
│  │  │  How are you feeling today?                      │      │        │
│  │  │                                                   │      │        │
│  │  │  [Calm] [Stressed] [Tempted] [Hopeful]          │      │        │
│  │  └──────────────────────────────────────────────────┘      │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                          │
│                                                                          │
│                                             ┌─────────────────────────┐ │
│                                             │  💬 AI Companion  [🗑][✕]│ │
│                                             ├─────────────────────────┤ │
│                                             │                         │ │
│                                             │  Hello! How can I       │ │
│                                             │  support you today?     │ │
│                                             │                         │ │
│                                             │           Hi, I'm       │ │
│                                             │           feeling good  │ │
│                                             │                         │ │
│                                             │  That's wonderful!      │ │
│                                             │  What's helping you     │ │
│                                             │  stay positive?         │ │
│                                             │                         │ │
│                                             ├─────────────────────────┤ │
│                                             │ [Type a message...] [→] │ │
│                                             └─────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Mobile View (< 640px)

```
┌────────────────────────────────┐
│  Daily Ritual                  │
│  Your space for daily reflection│
│                                │
│  ┌──────────────────────────┐  │
│  │  Streak: 7 Days 🔥       │  │
│  └──────────────────────────┘  │
│                                │
│  ┌──────────────────────────┐  │
│  │  How are you feeling?    │  │
│  │                          │  │
│  │  [Calm]    [Stressed]    │  │
│  │  [Tempted] [Hopeful]     │  │
│  └──────────────────────────┘  │
│                                │
│                                │
│                                │
│                                │
│                                │
│                                │
│                           [💬] │
└────────────────────────────────┘

Chat Opened (Full Screen):

┌────────────────────────────────┐
│ 💬 AI Companion      [🗑] [✕]  │
├────────────────────────────────┤
│                                │
│  Hello! How can I              │
│  support you today?            │
│                                │
│                   Hi, I'm      │
│                   feeling good │
│                                │
│  That's wonderful!             │
│  What's helping you            │
│  stay positive?                │
│                                │
│                                │
│                                │
│                                │
│                                │
│                                │
├────────────────────────────────┤
│ ┌────────────────────┐  ┌───┐ │
│ │ Type a message...  │  │ → │ │
│ │                    │  │   │ │
│ └────────────────────┘  └───┘ │
└────────────────────────────────┘
```

## Floating Button States

### Closed State
```
┌─────────────────────────┐
│                         │
│                         │
│                         │
│                         │
│                    [💬] │ ← Floating button (56×56px)
└─────────────────────────┘
   • Position: fixed bottom-4 right-4
   • Size: 56px × 56px (large touch target)
   • Shadow: shadow-lg
   • Hover: scale-110 transition
```

### Open State (Desktop)
```
┌─────────────────────────┐
│                         │
│                         │
│  ┌──────────────────┐   │
│  │ 💬 AI Companion  │   │ ← Chat window (384px × 500px)
│  │ ┌──────────────┐ │   │
│  │ │ Messages     │ │   │
│  │ │              │ │   │
│  │ │              │ │   │
│  │ │              │ │   │
│  │ │              │ │   │
│  │ └──────────────┘ │   │
│  │ [Input...] [→]   │   │
│  └──────────────────┘   │
└─────────────────────────┘
   • Position: fixed bottom-6 right-6
   • Size: 384px × 500px
   • Border: rounded-lg with shadow-xl
```

## Message Bubble Styles

### User Message (Right-aligned)
```
                  ┌────────────────────┐
                  │ Hi, I need help    │
                  │ staying focused    │
                  └────────────────────┘
```
- Background: primary (blue)
- Text: primary-foreground (white)
- Max-width: 80%
- Padding: px-4 py-2
- Border-radius: rounded-lg

### AI Message (Left-aligned)
```
┌────────────────────┐
│ I'm here to help.  │
│ What's on your     │
│ mind?              │
└────────────────────┘
```
- Background: muted (gray)
- Text: default text color
- Max-width: 80%
- Padding: px-4 py-2
- Border-radius: rounded-lg

## Loading States

### Fetching History
```
┌───────────────────────┐
│ 💬 AI Companion  [✕]  │
├───────────────────────┤
│                       │
│         ⟳             │ ← Spinning loader
│      Loading...       │
│                       │
├───────────────────────┤
│ [Type a message...] [→]│
└───────────────────────┘
```

### Sending Message
```
┌───────────────────────┐
│ 💬 AI Companion  [✕]  │
├───────────────────────┤
│                       │
│  Hi, I need help      │
│                       │
│  ⟳                    │ ← Typing indicator
│                       │
├───────────────────────┤
│ [Type a message...] [→]│
└───────────────────────┘
```

### Empty State
```
┌───────────────────────┐
│ 💬 AI Companion  [🗑][✕]│
├───────────────────────┤
│                       │
│        💬             │
│                       │
│  Start a conversation!│
│  I'm here to support  │
│        you.           │
│                       │
├───────────────────────┤
│ [Type a message...] [→]│
└───────────────────────┘
```

## Interactive Elements

### Buttons
```
[🗑] Clear History
  • Ghost variant
  • Icon only
  • Tooltip on hover
  • Disabled when no messages

[✕] Close Chat
  • Ghost variant
  • Icon only
  • Always enabled

[→] Send Message
  • Primary variant
  • 60×60px on mobile
  • Disabled when input empty
  • Disabled while sending
```

### Textarea Input
```
┌─────────────────────────┐
│ Type a message...       │ ← Placeholder
│                         │   Min height: 60px
│                         │   Max height: 120px
└─────────────────────────┘   Resize: none
```
- Enter to send
- Shift+Enter for new line
- Disabled while sending

## Keyboard Shortcuts

- **Enter**: Send message (when not Shift+Enter)
- **Shift+Enter**: New line in message
- **Escape**: Close chat (future enhancement)

## Animation & Transitions

1. **Button Hover**: `hover:scale-110` with transition
2. **Chat Open/Close**: Smooth fade-in/out
3. **Messages**: Auto-scroll with smooth behavior
4. **Loading**: Spinning animation for loaders

## Accessibility Features

- **ARIA Labels**: 
  - Button: "Open chat"
  - Clear: "Clear chat history"
  - Close: "Close chat"
- **Keyboard Navigation**: Tab through all interactive elements
- **Screen Reader**: Announces new messages
- **Focus Management**: Input focused when chat opens
- **High Contrast**: Works with system themes

## Color Scheme (Tailwind)

### Light Mode
- Background: white
- Border: gray-200
- User messages: blue-600 / white text
- AI messages: gray-100 / black text
- Button: blue-600

### Dark Mode (auto-detected)
- Background: gray-900
- Border: gray-700
- User messages: blue-500 / white text
- AI messages: gray-800 / white text
- Button: blue-500

## Responsive Breakpoints

| Screen Size | Chat Width | Button Margin | Window Height |
|-------------|------------|---------------|---------------|
| < 640px     | calc(100vw-2rem) | 1rem | max(100vh-2rem) |
| 640-1023px  | 384px | 1.5rem | 500px |
| ≥ 1024px    | 384px | 1.5rem | 500px |
```
