#!/bin/bash
# Pre-commit route verification script
# Purpose: Prevent common route path typos before they reach the repository

echo "🔍 Checking for common route path issues..."

# Check for /api/user/ (singular) when it should be /api/users/ (plural)
# Exclude comment lines (starting with //) to avoid false positives
if grep -v '^\s*\/\/' server/routes.ts 2>/dev/null | grep -q '/api/user/'; then
  echo ""
  echo "❌ ERROR: Found '/api/user/' pattern in server/routes.ts"
  echo ""
  echo "   Route paths must use PLURAL: /api/users/..."
  echo "   Found: /api/user/..."
  echo ""
  echo "   This is a RECURRING issue. See docs/COMMON_ISSUES.md for details."
  echo ""
  echo "   Locations found (excluding comments):"
  grep -v '^\s*\/\/' server/routes.ts | grep -n '/api/user/'
  echo ""
  exit 1
fi

echo "✅ Route paths look good!"
exit 0
