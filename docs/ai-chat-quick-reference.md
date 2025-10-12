# AI Chat Feature - Quick Reference

## For Developers

### Adding the Chat to a New Page
The chat is automatically available on all authenticated pages through `AppLayout`. No additional setup needed!

If you want to add it to a non-authenticated page:
```tsx
import { FloatingChat } from '@/components/chat/FloatingChat';

function MyPage() {
  return (
    <div>
      {/* Your page content */}
      <FloatingChat />
    </div>
  );
}
```

### Making API Calls from Frontend
```tsx
// Send a message
const response = await fetch('/api/chat/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ message: 'Hello!' })
});

// Get chat history
const history = await fetch('/api/chat/history?limit=20', {
  credentials: 'include'
});

// Clear history
await fetch('/api/chat/clear', {
  method: 'DELETE',
  credentials: 'include'
});
```

### Using the AI Chat Service in Backend
```typescript
import AIChatService from './server/services/aiChatService';

const chatService = new AIChatService();

// Send a message
const response = await chatService.sendMessage(userId, 'Hello!');

// Get messages
const messages = await chatService.getMessages(userId, 20);

// Clear history
await chatService.clearHistory(userId);
```

### Customizing the System Prompt
Edit `server/services/aiChatService.ts`:

```typescript
private createSystemPrompt(context: ChatContext): string {
  let prompt = `Your custom system prompt here...`;
  
  // Add context
  if (context.recentMood) {
    prompt += `\n\nUser's mood: ${context.recentMood}`;
  }
  
  return prompt;
}
```

### Changing AI Model Settings
Edit `server/services/aiChatService.ts` in the `sendMessage` method:

```typescript
const completion = await this.openai.chat.completions.create({
  model: 'gpt-3.5-turbo', // or 'gpt-4' for better responses
  messages,
  temperature: 0.7, // 0-1, higher = more creative
  max_tokens: 150, // Max response length
});
```

### Styling the Chat Component
The chat uses Tailwind CSS classes. Edit `client/src/components/chat/FloatingChat.tsx`:

```tsx
// Change button size
<Button className="h-16 w-16 rounded-full" />

// Change chat window size
<div className="w-96 h-[600px]" />

// Change message colors
<div className="bg-blue-600 text-white" /> // User
<div className="bg-gray-200 text-black" /> // AI
```

### Adding More Context to AI
Edit `getUserContext` in `server/services/aiChatService.ts`:

```typescript
private async getUserContext(userId: string): Promise<ChatContext> {
  // Add more data from database
  const userData = await this.dbClient
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);
    
  return {
    userId,
    recentMood: session?.mood,
    recentIntention: session?.intention,
    streakCount: session?.streakCount,
    username: userData[0]?.username, // Add custom fields
  };
}
```

### Debugging

#### Enable Verbose Logging
The service already logs to console:
```
[AIChatService] Error getting user context: ...
[Chat API] Error: ...
```

Check browser console and server logs for detailed error messages.

#### Test Without OpenAI
Mock the service in tests:
```typescript
vi.mock('../../server/services/aiChatService', () => ({
  default: vi.fn().mockImplementation(() => ({
    sendMessage: vi.fn().mockResolvedValue('Test response'),
  })),
}));
```

### Environment Variables

**Development:**
```bash
OPENAI_API_KEY=sk-test-key-for-development
```

**Production:**
Set in your hosting platform (Vercel, Railway, etc.):
```bash
vercel env add OPENAI_API_KEY
```

### Database Migrations

After modifying `shared/schema.ts`:
```bash
npm run db:push
```

To create a migration file:
```bash
npx drizzle-kit generate:pg
```

### Testing

Run all chat tests:
```bash
npm test -- api/chat
```

Run specific test file:
```bash
npm test -- api/chat/send.test.ts
```

### Common Issues

#### "OpenAI API key not configured"
✅ **Fix:** Set `OPENAI_API_KEY` in `.env` file

#### "Unauthorized" when calling API
✅ **Fix:** Ensure user is authenticated and JWT token is valid

#### Chat messages not saving
✅ **Fix:** Run `npm run db:push` to create the `chat_messages` table

#### Chat not appearing on page
✅ **Fix:** Ensure page is wrapped in `ProtectedRoute` and uses `AppLayout`

#### Styles not loading
✅ **Fix:** Run `npm install` to ensure all Tailwind dependencies are installed

### Performance Tips

1. **Rate Limiting**: Add rate limiting middleware to prevent abuse
2. **Message Limits**: Current limit is 1000 chars, adjust as needed
3. **History Limit**: Default is 20 messages, increase for more context
4. **Caching**: Consider caching user context to reduce DB queries
5. **Streaming**: Use OpenAI streaming API for real-time responses (future)

### Cost Management

OpenAI API costs per 1K tokens (approximate):
- **GPT-3.5-turbo**: $0.0015 input / $0.002 output
- **GPT-4**: $0.03 input / $0.06 output

With max_tokens=150:
- ~$0.0003 per message with GPT-3.5-turbo
- ~$0.01 per message with GPT-4

Monitor usage in OpenAI dashboard: https://platform.openai.com/usage

### Security Checklist

- ✅ Authentication required on all endpoints
- ✅ User can only access own messages
- ✅ Input validation (max 1000 chars)
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ XSS prevention (React auto-escapes)
- ✅ API key in environment variable
- ⚠️ Add rate limiting in production
- ⚠️ Monitor API usage and costs

### Future Enhancements

Want to contribute? Here are some ideas:

1. **Typing Indicator**: Show "AI is typing..." animation
2. **Message Timestamps**: Display time for each message
3. **Rich Media**: Support images, links, formatted text
4. **Voice Input**: Add speech-to-text
5. **Voice Output**: Add text-to-speech
6. **Reactions**: Allow users to like/dislike responses
7. **Export Chat**: Download conversation as PDF
8. **Smart Suggestions**: Quick reply buttons
9. **Crisis Detection**: Alert support team if user in crisis
10. **Multi-language**: Detect and respond in user's language

### Resources

- [OpenAI API Docs](https://platform.openai.com/docs/api-reference)
- [Drizzle ORM](https://orm.drizzle.team/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

### Getting Help

1. Check the [AI Chat Documentation](./ai-chat.md)
2. Review the [Architecture Diagram](./ai-chat-architecture.md)
3. Look at existing tests in `api/chat/send.test.ts`
4. Check console logs for error messages
5. Open an issue on GitHub

---

**Quick Commands:**
```bash
# Install dependencies
npm install

# Run TypeScript check
npm run check

# Run tests
npm test

# Build for production
npm run build

# Start dev server
npm run dev

# Push database schema
npm run db:push
```
