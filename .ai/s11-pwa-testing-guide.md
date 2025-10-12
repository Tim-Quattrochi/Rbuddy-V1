# Story 11: PWA Testing Guide

**Date:** October 11, 2025
**Story:** S11 - PWA Manifest & Service Worker Setup
**Status:** Implementation Complete - Manual Testing Required

---

## ✅ What's Been Implemented

### 1. PWA Manifest
- ✅ Created `client/public/manifest.json`
- ✅ Theme colors from Tailwind config (`#1a202e`)
- ✅ Standalone display mode
- ✅ Portrait orientation
- ✅ All required PWA fields

### 2. PWA Icons
- ✅ Generated using `@vite-pwa/assets-generator`
- ✅ 64x64, 192x192, 512x512 icons
- ✅ Maskable 512x512 icon for Android
- ✅ Apple Touch Icon (180x180)
- ✅ Favicon.ico

### 3. Service Worker
- ✅ vite-plugin-pwa configured in `vite.config.ts`
- ✅ Workbox caching strategies:
  - Cache-first for Google Fonts
  - Network-first for API calls (5s timeout)
- ✅ Auto-update with skipWaiting
- ✅ cleanupOutdatedCaches enabled

### 4. Build Verification
- ✅ Production build succeeds
- ✅ Service worker generated: `dist/public/sw.js`
- ✅ Manifest generated: `dist/public/manifest.webmanifest`
- ✅ All icons copied to dist

---

## 🧪 Manual Testing Steps

### Test 1: PWA Installation (Chrome Desktop)

1. **Start preview server:**
   ```bash
   npm run preview
   ```

2. **Open Chrome DevTools:**
   - Navigate to `http://localhost:4173`
   - Open DevTools (F12)
   - Go to Application tab

3. **Verify Manifest:**
   - Application → Manifest
   - Check all fields display correctly
   - Verify icons load

4. **Install PWA:**
   - Click address bar install icon (+)
   - Or use Application → Manifest → "Add to Home Screen"
   - Verify app opens in standalone window

5. **Expected Results:**
   - ✅ Manifest served correctly
   - ✅ Icons display
   - ✅ Install prompt appears
   - ✅ App opens without browser UI

### Test 2: Service Worker Verification

1. **Check Service Worker:**
   - DevTools → Application → Service Workers
   - Verify service worker registered
   - Status should be "activated and running"

2. **Inspect Cache Storage:**
   - Application → Cache Storage
   - Should see caches for:
     - workbox-precache (app shell)
     - google-fonts-cache
     - gstatic-fonts-cache

3. **Expected Results:**
   - ✅ Service worker active
   - ✅ Precache populated
   - ✅ No errors in console

### Test 3: Offline Functionality

1. **Load app while online:**
   - Visit `http://localhost:4173`
   - Wait for full load

2. **Go offline:**
   - DevTools → Application → Service Workers
   - Check "Offline" checkbox

3. **Reload app:**
   - Press Cmd+R (Mac) or Ctrl+R (Windows)
   - App should load from cache

4. **Expected Results:**
   - ✅ App loads offline
   - ✅ UI displays correctly
   - ✅ No broken images
   - ✅ Service worker serves cached assets

### Test 4: Lighthouse PWA Audit

1. **Run Lighthouse:**
   - DevTools → Lighthouse tab
   - Select "Progressive Web App" category
   - Click "Analyze page load"

2. **Target Scores:**
   - PWA Score: ≥ 90
   - Performance: ≥ 80
   - Accessibility: ≥ 90
   - Best Practices: ≥ 90

3. **Key PWA Checks:**
   - ✅ Manifest with name, icons, display
   - ✅ Service worker registered
   - ✅ HTTPS (or localhost)
   - ✅ Viewport meta tag
   - ✅ Installable

4. **Expected Results:**
   - ✅ PWA badge earned
   - ✅ All installability checks pass
   - ✅ No manifest errors

### Test 5: Mobile Testing (iOS Safari)

1. **Open Safari on iPhone:**
   - Navigate to deployed URL (or use ngrok for local)

2. **Add to Home Screen:**
   - Tap Share button
   - Select "Add to Home Screen"
   - Tap "Add"

3. **Open installed PWA:**
   - Tap icon on home screen
   - Verify standalone mode (no Safari UI)

4. **Expected Results:**
   - ✅ Icon appears on home screen
   - ✅ Splash screen shows
   - ✅ App opens without browser UI
   - ✅ Status bar matches theme color

### Test 6: Mobile Testing (Android Chrome)

1. **Open Chrome on Android:**
   - Navigate to deployed URL

2. **Install PWA:**
   - Banner should appear: "Add Next Moment to Home screen"
   - Tap "Install"

3. **Expected Results:**
   - ✅ Install banner appears
   - ✅ Maskable icon displays correctly
   - ✅ App opens in standalone mode

---

## 📊 Acceptance Criteria Verification

| Criteria | Status | Notes |
|----------|--------|-------|
| Manifest.json created | ✅ | All required fields present |
| PWA icons generated | ✅ | 64, 192, 512, maskable |
| vite-plugin-pwa configured | ✅ | Workbox strategies set |
| Service worker caches app shell | ✅ | Verified in build output |
| Lighthouse PWA score ≥ 90 | ⏳ | Requires manual testing |
| "Add to Home Screen" prompt | ⏳ | Requires browser testing |
| Standalone mode works | ⏳ | Requires installation test |
| App loads offline | ⏳ | Requires offline test |

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Run Lighthouse audit on production build
- [ ] Test on iOS Safari (iPhone)
- [ ] Test on Android Chrome
- [ ] Verify HTTPS certificate (required for PWA)
- [ ] Test offline functionality on mobile
- [ ] Verify push notification permissions work (future story)

---

## 🐛 Known Issues / Limitations

1. **Icons are MVP placeholders**
   - Simple "RB" text on dark background
   - Replace with professionally designed icons before pilot

2. **iOS Safari limitations**
   - No push notifications support
   - Limited service worker features
   - Plan fallback for iOS users

3. **Dev mode service worker**
   - Enabled for local testing
   - May behave differently in production

---

## 📝 Next Steps

1. **Create S12:** Daily Ritual Flow UI Components
   - MoodSelector.tsx
   - AffirmationCard.tsx
   - IntentionInput.tsx

2. **Test PWA installation manually**
   - Run Lighthouse audit
   - Document actual scores

3. **Update handoff.md**
   - Document PWA setup complete
   - Mark Phase 4 progress

---

**Testing Status:** Ready for Manual QA
**Build Status:** ✅ Passing
**Deployment:** Ready for Vercel
