import type { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';
import ConversationEngine from '../../../server/services/conversationEngine';

export default async (req: VercelRequest, res: VercelResponse) => {
  const twilioSignature = req.headers['x-twilio-signature'] as string;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  const url = `https://${req.headers['x-forwarded-host']}${req.url}`;

  const isValid = twilio.validateRequest(authToken!, twilioSignature, url, req.body);

  if (!isValid) {
    return res.status(403).send('Forbidden');
  }

  const { From, Body } = req.body;

  console.log(`[SMS Webhook] Received from ${From}: ${Body}`);

  try {
    // Process input through ConversationEngine
    const engine = new ConversationEngine();
    const responseMessage = await engine.processInput(From, Body, 'sms');

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