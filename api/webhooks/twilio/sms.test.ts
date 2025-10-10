import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock the twilio module before importing the handler
vi.mock('twilio', () => {
  const mockValidateRequest = vi.fn();
  const mockMessagingResponse = vi.fn(() => ({
    toString: () => '<?xml version="1.0" encoding="UTF-8"?><Response/>'
  }));

  return {
    default: {
      validateRequest: mockValidateRequest,
      twiml: {
        MessagingResponse: mockMessagingResponse
      }
    },
    validateRequest: mockValidateRequest
  };
});

describe('Twilio SMS Webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('TWILIO_AUTH_TOKEN', 'test-token');
  });

  it('should return 403 for an invalid signature', async () => {
    const twilio = await import('twilio');
    vi.mocked(twilio.validateRequest).mockReturnValue(false);

    const handler = (await import('./sms')).default;

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

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Forbidden');
  });

  it('should return 200 for a valid signature', async () => {
    const twilio = await import('twilio');
    vi.mocked(twilio.validateRequest).mockReturnValue(true);

    const handler = (await import('./sms')).default;

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

    handler(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'text/xml' });
    expect(res.end).toHaveBeenCalledWith('<?xml version="1.0" encoding="UTF-8"?><Response/>');
  });
});
