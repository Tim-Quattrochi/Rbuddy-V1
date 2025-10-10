import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import handler from './sms';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const server = setupServer();

describe('Twilio SMS Webhook', () => {
  it('should return 403 for an invalid signature', async () => {
    const req = {
      headers: {
        'x-twilio-signature': 'invalid-signature',
        'x-forwarded-host': 'localhost:3000'
      },
      url: '/api/webhooks/twilio/sms',
      body: {}
    } as unknown as VercelRequest;

    const res = {
      status: vi.fn(() => res),
      send: vi.fn()
    } as unknown as VercelResponse;

    vi.stubGlobal('process', { ...global.process, env: { TWILIO_AUTH_TOKEN: 'test-token' } });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Forbidden');
  });

  it('should return 200 for a valid signature', async () => {
    // This is a bit tricky to test without a real signature. 
    // We will mock the validateRequest function to return true.
    const twilio = await import('twilio');
    const validateRequestSpy = vi.spyOn(twilio, 'validateRequest').mockReturnValue(true);

    const req = {
      headers: {
        'x-twilio-signature': 'valid-signature',
        'x-forwarded-host': 'localhost:3000'
      },
      url: '/api/webhooks/twilio/sms',
      body: { From: '+1234567890', Body: 'Hello' }
    } as unknown as VercelRequest;

    const res = {
      writeHead: vi.fn(),
      end: vi.fn()
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'text/xml' });
    expect(res.end).toHaveBeenCalledWith('<?xml version="1.0" encoding="UTF-8"?><Response/>');

    validateRequestSpy.mockRestore();
  });
});
