# External API Integration

## Twilio API

- **Purpose**: Send/receive SMS, make/receive voice calls
- **Documentation**: https://www.twilio.com/docs/sms/api, https://www.twilio.com/docs/voice/api
- **Base URL**: `https://api.twilio.com/2010-04-01`
- **Authentication**: Account SID + Auth Token (HTTP Basic Auth)
- **Integration Method**: Node.js SDK (`npm install twilio`)

**Key Endpoints Used:**
- `POST /Accounts/{AccountSid}/Messages.json` - Send SMS
- `POST /Accounts/{AccountSid}/Calls.json` - Initiate outbound call
- **Webhooks**: Twilio calls our `/api/webhooks/twilio/*` endpoints

**Error Handling**:
- Validate webhook signatures to prevent spoofing
- Retry failed SMS sends (Twilio SDK handles)
- Log all Twilio errors to CloudWatch/Vercel logs
