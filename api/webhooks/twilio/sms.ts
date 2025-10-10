import type { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';
import ConversationEngine from '../../../server/services/conversationEngine';

// Module-level singleton engine to avoid creating a new instance per request
// in serverless environments. The ConversationEngine uses a static state store
// to keep short-lived state across warm invocations.
const engine = new ConversationEngine();

export default async (req: VercelRequest, res: VercelResponse) => {
  const twilioSignature = req.headers['x-twilio-signature'] as string | undefined;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!authToken) {
    console.error('[SMS Webhook] TWILIO_AUTH_TOKEN is not set. Cannot validate request.');
    return res.status(500).send('Internal Server Error');
  }

  if (!twilioSignature) {
    console.warn('[SMS Webhook] Missing X-Twilio-Signature header. Rejecting request.');
    return res.status(400).send('Bad Request');
  }

  const url = `https://${req.headers['x-forwarded-host']}${req.url}`;

  const isValid = twilio.validateRequest(authToken, twilioSignature, url, req.body);

  if (!isValid) {
    return res.status(403).send('Forbidden');
  }

  const { From, Body } = req.body as { From?: string; Body?: string };

  console.log(`[SMS Webhook] Received from ${From}: ${Body}`);

  try {
    // Process input through singleton ConversationEngine
    const responseMessage = await engine.processInput(From ?? 'unknown', Body ?? '', 'sms');

    // Return TwiML response with engine's message
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(responseMessage);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } catch (error) {
    console.error('[SMS Webhook] Error processing message:', error);

    // Fallback response on error (within 10s Twilio timeout)
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Sorry, something went wrong. Please try again.');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }
};