# 3. User Stories and Acceptance Criteria

## 3.1 Core SMS Flow
**Story:** As a returning citizen, I want a daily check-in by text so I can ground myself.
- **Given:** System sends daily SMS prompt.
- **When:** User replies with mood (1–4).
- **Then:** User receives affirmation and can set intention.
- **Acceptance:** Response logs successfully; streak counter updates.

## 3.2 IVR Flow
**Story:** As a user without texting ability, I can call or receive a voice call for my daily check-in.
- **Given:** User receives IVR prompt.
- **When:** User presses 1–4 for mood.
- **Then:** System plays supportive message and logs session.

## 3.3 Repair Flow
**Story:** When I relapse, I can text "SLIP" and receive compassion, not judgment.
- **Acceptance:** System logs relapse, schedules next-day follow-up, and resets streak gracefully.

## 3.4 Encouragement Loop
**Story:** When I skip a few days, the system reminds me gently.
- **Acceptance:** If inactivity > 3 days, user receives motivation message.

## 3.5 Data Logging & Privacy
**Story:** As an operator, I can see anonymized aggregate data.
- **Acceptance:** Reports show trends only (no phone numbers).
