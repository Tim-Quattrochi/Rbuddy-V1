# Floating AI Chat - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │              AppLayout.tsx                             │     │
│  │  ┌──────────────────────────────────────────────┐     │     │
│  │  │         DailyRitual Page                     │     │     │
│  │  │  (and other authenticated pages)             │     │     │
│  │  └──────────────────────────────────────────────┘     │     │
│  │                                                        │     │
│  │  ┌──────────────────────────────────────────────┐     │     │
│  │  │      FloatingChat Component                  │     │     │
│  │  │                                              │     │     │
│  │  │  [💬] Floating Button                        │     │     │
│  │  │                                              │     │     │
│  │  │  ┌────────────────────────────────┐         │     │     │
│  │  │  │  Chat Window (when open)       │         │     │     │
│  │  │  │  ┌──────────────────────────┐  │         │     │     │
│  │  │  │  │ Header [Clear] [X]       │  │         │     │     │
│  │  │  │  ├──────────────────────────┤  │         │     │     │
│  │  │  │  │ Messages Area            │  │         │     │     │
│  │  │  │  │  • User messages (right) │  │         │     │     │
│  │  │  │  │  • AI messages (left)    │  │         │     │     │
│  │  │  │  │  • Auto-scroll           │  │         │     │     │
│  │  │  │  ├──────────────────────────┤  │         │     │     │
│  │  │  │  │ Input Area               │  │         │     │     │
│  │  │  │  │ [Textarea] [Send Button] │  │         │     │     │
│  │  │  │  └──────────────────────────┘  │         │     │     │
│  │  │  └────────────────────────────────┘         │     │     │
│  │  └──────────────────────────────────────────────┘     │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                   │
│  Uses: @tanstack/react-query for state management               │
│  Styling: Tailwind CSS (mobile-first responsive)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              │ (with auth cookie)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API (Express)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  server/routes.ts                                      │     │
│  │                                                        │     │
│  │  POST   /api/chat/send      [requireAuth]             │     │
│  │  GET    /api/chat/history   [requireAuth]             │     │
│  │  DELETE /api/chat/clear     [requireAuth]             │     │
│  └────────────────────────────────────────────────────────┘     │
│                              │                                    │
│                              │                                    │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  api/chat/send.ts                                      │     │
│  │  api/chat/history.ts                                   │     │
│  │  api/chat/clear.ts                                     │     │
│  └────────────────────────────────────────────────────────┘     │
│                              │                                    │
│                              │ Calls                              │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────┐     │
│  │       server/services/aiChatService.ts                 │     │
│  │                                                        │     │
│  │  • sendMessage(userId, message)                        │     │
│  │  • getMessages(userId, limit)                          │     │
│  │  • clearHistory(userId)                                │     │
│  │  • getUserContext(userId) ← Gets mood, intention       │     │
│  └────────────────────────────────────────────────────────┘     │
│                              │                                    │
│            ┌─────────────────┴───────────────────┐               │
│            │                                     │               │
│            ▼                                     ▼               │
│  ┌──────────────────────┐          ┌──────────────────────┐    │
│  │   OpenAI API         │          │   Database           │    │
│  │   (GPT-3.5-turbo)    │          │   (PostgreSQL)       │    │
│  │                      │          │                      │    │
│  │  • System prompt     │          │  Tables:             │    │
│  │    with context      │          │  • chat_messages     │    │
│  │  • Chat completion   │          │  • sessions          │    │
│  │  • Max 150 tokens    │          │  • users             │    │
│  └──────────────────────┘          └──────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Data Flow Example                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User types "How are you?" in FloatingChat                    │
│                     │                                             │
│                     ▼                                             │
│  2. POST /api/chat/send { message: "How are you?" }              │
│                     │                                             │
│                     ▼                                             │
│  3. requireAuth middleware validates JWT                          │
│                     │                                             │
│                     ▼                                             │
│  4. aiChatService.sendMessage(userId, "How are you?")            │
│                     │                                             │
│         ┌───────────┴────────────┐                               │
│         │                        │                               │
│         ▼                        ▼                               │
│  5a. Get user context      5b. Save user message                 │
│      (mood, intention,          to database                      │
│       streak from DB)                                            │
│         │                                                         │
│         ▼                                                         │
│  6. Build system prompt with context                             │
│     "You are a compassionate AI companion...                     │
│      User recently felt 'calm'..."                               │
│                     │                                             │
│                     ▼                                             │
│  7. Call OpenAI API with:                                        │
│     • System prompt (with context)                               │
│     • Chat history (last 10 messages)                            │
│     • New user message                                           │
│                     │                                             │
│                     ▼                                             │
│  8. Get AI response from OpenAI                                  │
│                     │                                             │
│                     ▼                                             │
│  9. Save AI response to database                                 │
│                     │                                             │
│                     ▼                                             │
│  10. Return { response: "I'm here to support you..." }           │
│                     │                                             │
│                     ▼                                             │
│  11. FloatingChat updates UI with new messages                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Mobile Responsiveness                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Mobile (< 640px)        Tablet (640-1023px)    Desktop (1024+)  │
│  ┌──────────────┐        ┌──────────┐          ┌──────────┐    │
│  │ Full Width   │        │  Fixed   │          │  Fixed   │    │
│  │ Chat Window  │        │  384px   │          │  384px   │    │
│  │              │        │          │          │          │    │
│  │              │        │          │          │          │    │
│  │              │        │          │          │          │    │
│  │              │        │          │          │          │    │
│  │              │        │          │          │          │    │
│  │       [💬]   │        │   [💬]   │          │   [💬]   │    │
│  └──────────────┘        └──────────┘          └──────────┘    │
│                                                                   │
│  • Touch targets: 56px+                                          │
│  • Smooth animations                                             │
│  • Auto-scroll on new messages                                   │
│  • Safe area padding for iOS                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```
