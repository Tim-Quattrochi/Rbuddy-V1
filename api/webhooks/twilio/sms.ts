import type { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';

export default (req: VercelRequest, res: VercelResponse) => {
  const twilioSignature = req.headers['x-twilio-signature'] as string;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  const url = `https://${req.headers['x-forwarded-host']}${req.url}`;

  const isValid = twilio.validateRequest(authToken!, twilioSignature, url, req.body);

  if (!isValid) {
    return res.status(403).send('Forbidden');
  }

  const { From, Body } = req.body;

  console.log(`Received SMS from ${From}: ${Body}`);

  const twiml = new twilio.twiml.MessagingResponse();

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};