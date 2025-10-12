import { vi } from 'vitest';

const mockValidateRequest = vi.fn();

const mockMessagingResponse = vi.fn(() => {
  let messageText = '';
  return {
    message: (text: string) => {
      messageText = text;
    },
    toString: () => `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${messageText}</Message></Response>`
  };
});

export default {
  validateRequest: mockValidateRequest,
  twiml: {
    MessagingResponse: mockMessagingResponse
  }
};

export const validateRequest = mockValidateRequest;
