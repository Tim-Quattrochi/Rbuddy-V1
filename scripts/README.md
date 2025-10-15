# Route Verification Scripts

This directory contains automated checks to prevent common routing issues.

## Available Scripts

### `check-routes.sh`

Verifies that route paths follow project conventions, specifically:
- Ensures `/api/users/...` (plural) is used instead of `/api/user/...` (singular)

**Usage:**
```bash
# Manual check
./scripts/check-routes.sh

# As part of CI/CD
npm run check:routes
```

**Exit Codes:**
- `0`: All routes are correct
- `1`: Found problematic route patterns

## Integration Options

### Option 1: NPM Script (Recommended)

Add to `package.json`:
```json
{
  "scripts": {
    "check:routes": "./scripts/check-routes.sh",
    "pretest": "npm run check:routes"
  }
}
```

This will run the check before every test run.

### Option 2: Git Pre-Commit Hook

Install as a git hook:
```bash
cp scripts/check-routes.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

This will prevent commits that contain the problematic pattern.

### Option 3: CI/CD Pipeline

Add to your GitHub Actions workflow:
```yaml
- name: Check route paths
  run: npm run check:routes
```

## Why This Exists

The `/api/user/` vs `/api/users/` typo has occurred multiple times in this project's history. These scripts prevent this specific recurring issue from reaching production.

See `docs/COMMON_ISSUES.md` for complete documentation.

## Adding New Checks

To add more route verification rules:

1. Edit `check-routes.sh`
2. Add new grep pattern with clear error message
3. Update this README
4. Test the script manually
5. Document the pattern in `docs/COMMON_ISSUES.md`

## Related Documentation

- [Common Issues](../docs/COMMON_ISSUES.md) - Full documentation of recurring issues
- [Incident Report](../docs/qa/incidents/2025-10-14-user-users-typo.md) - Historical context
- [API Design Guidelines](../docs/architecture/6-api-design-and-integration.md)
