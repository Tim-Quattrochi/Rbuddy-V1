# AI Chat Feature Documentation

## Overview
The AI Chat feature provides an intelligent, context-aware companion for authenticated users. Powered by OpenAI's GPT-3.5-turbo, the chat bot understands user context including recent mood, intentions, and streak progress.

## Features
- 💬 **Floating Chat UI**: Mobile-responsive chat widget that appears on authenticated pages
- 🧠 **Context-Aware**: AI has access to user's recent mood, intentions, and streak count
- 📝 **Persistent History**: Chat messages are stored in the database
- 🔒 **Secure**: Only authenticated users can access the chat
- 📱 **Mobile Responsive**: Works seamlessly on all screen sizes

## Setup

### Environment Variables
Add your OpenAI API key to your `.env` file:

```bash
OPENAI_API_KEY=sk-...your-key-here...
```

### Database Schema
The chat feature uses a new table `chat_messages`:

```sql
CREATE TABLE chat_messages (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  role chat_role NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Push the schema changes to your database:

```bash
npm run db:push
```

## API Endpoints

### POST /api/chat/send
Send a message to the AI chat bot.

**Request:**
```json
{
  "message": "How are you?"
}
```

**Response:**
```json
{
  "response": "I'm here to support you. How are you feeling today?"
}
```

### GET /api/chat/history
Get chat history for the authenticated user.

**Query Parameters:**
- `limit` (optional): Number of messages to retrieve (default: 20)

**Response:**
```json
{
  "messages": [
    {
      "id": "msg-123",
      "role": "user",
      "content": "Hello",
      "createdAt": "2025-10-12T12:00:00Z"
    },
    {
      "id": "msg-124",
      "role": "assistant",
      "content": "Hi! I'm here to support you.",
      "createdAt": "2025-10-12T12:00:01Z"
    }
  ]
}
```

### DELETE /api/chat/clear
Clear chat history for the authenticated user.

**Response:**
```json
{
  "success": true
}
```

## Frontend Component

### FloatingChat Component
The `FloatingChat` component is automatically added to all authenticated pages via the `AppLayout` component.

**Location:** `client/src/components/chat/FloatingChat.tsx`

**Features:**
- Floating button in bottom-right corner
- Expandable chat window
- Auto-scroll to new messages
- Clear history option
- Loading states
- Error handling

## Context Awareness

The AI chat service automatically includes user context in the system prompt:

- **Recent Mood**: "The user recently shared they were feeling 'calm'."
- **Recent Intention**: "Their recent intention was: 'Stay focused on my recovery.'"
- **Streak Count**: "They have a 7-day streak!"

This allows the AI to provide more personalized and relevant responses.

## Testing

Run the chat API tests:

```bash
npm test -- api/chat/send.test.ts
```

## Security Considerations

1. **Authentication Required**: All chat endpoints require authentication via JWT token
2. **User Isolation**: Users can only access their own chat history
3. **Input Validation**: Messages are validated for length and content
4. **Rate Limiting**: Consider adding rate limiting in production
5. **API Key Security**: Keep your OpenAI API key secure and never commit it to version control

## Future Enhancements

- [ ] Add rate limiting to prevent abuse
- [ ] Implement typing indicators
- [ ] Add message timestamps in the UI
- [ ] Support for rich media responses
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Sentiment analysis for better context
- [ ] Crisis detection and intervention
