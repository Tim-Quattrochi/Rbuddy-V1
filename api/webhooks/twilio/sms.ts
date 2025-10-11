import type { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

// Diagnostic: Add logging at import time
console.log('[SMS Webhook Diagnostic] Module loading started');
console.log('[SMS Webhook Diagnostic] Environment:', process.env.NODE_ENV);
console.log('[SMS Webhook Diagnostic] Platform:', process.platform);

// Import with diagnostic logging
import ConversationEngine from '../../../server/services/conversationEngine.js';
import { db } from '../../../server/storage.js';

console.log('[SMS Webhook Diagnostic] Imports successful');
console.log('[SMS Webhook Diagnostic] ConversationEngine type:', typeof ConversationEngine);
console.log('[SMS Webhook Diagnostic] db type:', typeof db);

// Module-level singleton engine to avoid creating a new instance per request
// in serverless environments. The ConversationEngine uses a static state store
// to keep short-lived state across warm invocations.
const engine = new ConversationEngine(db);

export default async (req: VercelRequest, res: VercelResponse) => {
  console.log('[SMS Webhook] Handler invoked');
  console.log('[SMS Webhook] Request method:', req.method);
  console.log('[SMS Webhook] Request URL:', req.url);
  
  try {
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

  const { From, Body, To, MessageSid } = req.body as {
    From?: string;
    Body?: string;
    To?: string;
    MessageSid?: string;
  };

  // Validate required fields - From and To are essential for user identification
  if (!From || !To) {
    console.error('[SMS Webhook] Missing From or To in request body.');
    return res.status(400).send('Bad Request: Missing required fields.');
  }

  console.log(`[SMS Webhook] Received from ${From}: ${Body}`);

  try {
    // Log inbound message to database
    await engine.logMessage(
      'inbound',
      From,
      To,
      Body ?? '',
      MessageSid
    );

    // Process input through singleton ConversationEngine
    const responseMessage = await engine.processInput(From, Body ?? '', 'sms');

    // Log outbound message to database
    await engine.logMessage(
      'outbound',
      To, // System phone number (from)
      From, // User phone number (to)
      responseMessage,
      undefined // Twilio generates SID after send
    );

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
  } catch (error) {
    console.error('[SMS Webhook] Unhandled error in handler:', error);
    console.error('[SMS Webhook] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return res.status(500).send('Internal Server Error');
  }
};