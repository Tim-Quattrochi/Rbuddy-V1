# Security Integration

## Existing Security Measures

- **Authentication**: Passport.js local strategy (not used in SMS/IVR)
- **Authorization**: None
- **Data Protection**: PostgreSQL password hashing (bcrypt)
- **Security Tools**: None

## Enhancement Security Requirements

**New Security Measures**:
1. **Twilio Signature Validation**: Prevent webhook spoofing
2. **Phone Number Anonymization**: Store hashed phone numbers
3. **Database Encryption**: Neon PostgreSQL TLS connections
4. **Rate Limiting**: Vercel built-in (60 req/min per IP)

**Integration Points**:
- Every Twilio webhook MUST validate signature
- Never log full phone numbers (mask last 4 digits)
- Use environment variables for secrets (never commit)

**Compliance Requirements**:
- No HIPAA data stored (mood is not PHI)
- SMS opt-out supported ("STOP" keyword)
- Data retention: 90 days (auto-delete old sessions)

## Security Testing

- **Existing Security Tests**: None
- **New Security Test Requirements**:
  1. Test invalid Twilio signature rejected
  2. Test SQL injection prevention (Drizzle ORM handles)
  3. Test "STOP" keyword unsubscribes user

- **Penetration Testing**: Not required for MVP
