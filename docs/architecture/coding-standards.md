# Coding Standards

## Existing Standards Compliance

- **Code Style**: TypeScript strict mode, Prettier formatting
- **Linting Rules**: ESLint with React/TypeScript rules
- **Testing Patterns**: None (no tests exist yet)
- **Documentation Style**: Inline JSDoc comments

## Critical Integration Rules

- **Twilio Webhook Security**: ALWAYS validate `X-Twilio-Signature` header
  ```typescript
  import twilio from 'twilio';

  const isValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    req.headers['x-twilio-signature'] as string,
    `https://yourdomain.com${req.url}`,
    req.body
  );

  if (!isValid) return res.status(403).send('Forbidden');
  ```

- **Database Integration**: Use Drizzle ORM, no raw SQL
  ```typescript
  import { db } from '../server/storage';
  import { sessions } from '../shared/schema';

  await db.insert(sessions).values({ userId, flowType: 'daily', mood: 'calm' });
  ```

- **Error Handling**: Always respond to Twilio within 10 seconds
  ```typescript
  try {
    const response = await conversationEngine.process(input);
    res.status(200).send(twimlResponse(response));
  } catch (error) {
    // Fallback message
    res.status(200).send(twimlResponse('Sorry, please try again.'));
  }
  ```

- **Logging Consistency**: Use `console.log` for Vercel logs (captured automatically)
  ```typescript
  console.log(`[SMS] Received from ${fromNumber}: ${body}`);
  ```
