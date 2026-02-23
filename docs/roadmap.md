# HabitBuddy MVP — Implementation Roadmap

**Version:** 1.0  
**Created:** 2026-02-20  
**Aligned with:** PRD v2.0  
**Estimated Total Duration:** 8–12 weeks (solo developer, part-time)

---

## Overview

```
Phase 0   ████████████████████  Project Scaffolding
Phase 1   ░░██░░░░░░░░░░░░░░░░  Auth & Onboarding
Phase 2   ░░░░██░░░░░░░░░░░░░░  Core Data Layer
Phase 3   ░░░░░░██░░░░░░░░░░░░  Home Screen
Phase 4   ░░░░░░░░████░░░░░░░░  Mission Flow (core feature)
Phase 5   ░░░░░░░░░░░░██░░░░░░  Reward System
Phase 6   ░░░░░░░░░░░░░░██░░░░  Parent Dashboard
Phase 7   ░░░░░░░░░░░░░░░░██░░  Offline & Sync
Phase 8   ░░░░░░░░░░░░░░░░░░██  Polish, Testing & Release Prep
```

> **Phases 4 is the longest** because it contains the mission flow, buddy state machine, Reanimated programmatic animations, and audio system — the heart of the app.

---

## Phase 0: Project Scaffolding

**Goal:** A running Flutter app with all dependencies installed, folder structure defined, and Supabase project provisioned.

**Duration:** 2–3 days

### Tasks

| #   | Task                      | Details                                                                        |
| :-- | :------------------------ | :----------------------------------------------------------------------------- |
| 0.1 | Create Expo project       | `npx create-expo-app habit_buddy --template tabs`                              |
| 0.2 | Define folder structure   | See §Structure below                                                           |
| 0.3 | Install core dependencies | See §Dependencies below                                                        |
| 0.4 | Create Supabase project   | Provision on [supabase.com](https://supabase.com), note project URL + anon key |
| 0.5 | Configure flavors / env   | Separate `dev` and `prod` Supabase URLs via `.env` and `app.config.js`         |
| 0.6 | Set up linting            | `eslint` and `prettier`                                                        |
| 0.7 | Verify clean build        | `npx expo start` on both iOS Simulator and Android Emulator                    |
| 0.8 | Initialize Git repo       | `.gitignore`, initial commit, branch strategy (`main` + `develop`)             |

### Folder Structure

```
app/                        # Expo Router pages
├── (auth)/                 # Sign-in, onboarding
├── (tabs)/                 # Home, dashboard, rewards
├── mission/                # Mission active + result screens
└── _layout.tsx
src/
├── components/             # Shared UI widgets and feature components
├── lib/                    # Supabase client, audio service, local DB setup
├── store/                  # Zustand stores (Buddy FSM, Auth state)
├── theme/                  # Theme constants (colors, spacing, typography)
├── types/                  # TypeScript interfaces (Profile, HabitLog, Coupon)
└── utils/                  # Helpers, constants
assets/
├── props/                  # Floating mission props
├── audio/
│   ├── music/              # Background loops
│   ├── sfx/                # Sound effects
│   └── vo/                 # Voice-over clips
├── images/                 # Fallback PNGs, splash, app icon source
└── fonts/                  # Fredoka One, Nunito
```

### Core Dependencies

```json
"dependencies": {
  "expo": "~50.0.0",
  "react-native": "0.73.0",

  "expo-router": "~3.4.0",
  "zustand": "^4.5.0",

  "@supabase/supabase-js": "^2.39.0",
  "expo-sqlite": "~13.2.0",
  "expo-secure-store": "~12.8.1",

  "react-native-reanimated": "~3.6.2",
  "expo-av": "~13.10.0",

  "@expo-google-fonts/fredoka-one": "^0.2.3",
  "@expo-google-fonts/nunito": "^0.2.3",
  "react-native-svg": "14.1.0",

  "date-fns": "^3.3.0",
  "uuid": "^9.0.1",
  "@react-native-community/netinfo": "11.1.0"
},
"devDependencies": {
  "prettier": "^3.2.0",
  "eslint": "^8.56.0",
  "jest": "^29.7.0",
  "jest-expo": "~50.0.0",
  "@testing-library/react-native": "^12.4.0",
  "typescript": "^5.3.0"
}
```

### Acceptance Criteria

- [x] `npx expo start` succeeds on iOS Simulator
- [x] `npx expo start` succeeds on Android Emulator
- [x] Supabase project accessible, anon key configured
- [x] Fonts (Fredoka One, Nunito) render correctly
- [x] Git repo initialized with clean first commit

---

## Phase 1: Auth & Onboarding

**Goal:** A parent can sign in with Google/Apple or continue anonymously. First-run onboarding collects the child's name.

**Duration:** 3–5 days  
**Depends on:** Phase 0

### Tasks

| #    | Task                       | Details                                                                       |
| :--- | :------------------------- | :---------------------------------------------------------------------------- |
| 1.1  | Configure Supabase Auth    | Enable Google + Apple OAuth providers in Supabase dashboard                   |
| 1.2  | Initialize Supabase client | `createClient` in `src/lib/supabase.ts` with env-based URL/key                |
| 1.3  | Build Sign-In screen       | Google + Apple buttons, "Continue without account" link (PRD §6, Screen 9)    |
| 1.4  | Implement OAuth flow       | `supabase.auth.signInWithOAuth()` for Google and Apple                        |
| 1.5  | Implement anonymous mode   | Create a local profile without Supabase auth — store in local DB              |
| 1.6  | Build Onboarding screen    | Child name input, friendly buddy illustration, "Let's Go!" button (Screen 2)  |
| 1.7  | Create Profile type        | `Profile` TypeScript interface matching PRD §7.1 schema                       |
| 1.8  | Save profile               | To Supabase (authenticated) or local Expo SQLite (anonymous)                  |
| 1.9  | Set up Expo Router         | Layout logic: unauthenticated → Sign-In, no profile → Onboarding, else → Home |
| 1.10 | Auth state listener        | Listen to `supabase.auth.onAuthStateChange` to handle sign-in/out             |

### Acceptance Criteria

- [x] Google OAuth flow works end-to-end (sign in → profile created in Supabase)
- [ ] Apple OAuth flow works end-to-end
- [x] Anonymous mode works (no sign-in, profile saved locally)
- [x] Onboarding screen appears on first launch only
- [x] Expo Router redirects correctly based on auth + profile state
- [x] Sign-out returns to Sign-In screen

---

## Phase 2: Core Data Layer

**Goal:** All data models, repositories, and services are built. Data can be read/written to both Supabase and local SQLite.

**Duration:** 4–5 days  
**Depends on:** Phase 1

### Tasks

| #    | Task                      | Details                                                          |
| :--- | :------------------------ | :--------------------------------------------------------------- |
| 2.1  | Apply Supabase migrations | Create `profiles`, `habits_log`, `coupons` tables (PRD §7.1)     |
| 2.2  | Enable Row-Level Security | RLS policies: users can only access their own data (PRD §7.2)    |
| 2.3  | Create local SQLite DB    | Mirror Supabase schema in local SQLite using Expo SQLite         |
| 2.4  | Define TS Interfaces      | `Profile`, `HabitLog`, `Coupon`                                  |
| 2.5  | Build `ProfileService`    | CRUD operations, abstracts Supabase-vs-local based on auth state |
| 2.6  | Build `HabitLogService`   | `logCompletion()`, `getTodaysLogs()`, `getStreakData()`          |
| 2.7  | Build `CouponService`     | CRUD, `redeem()`, `getAvailable()`, `getRedeemed()`              |
| 2.8  | Build network listener    | Wraps `@react-native-community/netinfo`                          |
| 2.9  | Build `SyncService`       | Queues offline writes, syncs on reconnect (PRD FR-SYNC-03)       |
| 2.10 | Unit tests                | Test each service with mocked Supabase client                    |

### Acceptance Criteria

- [x] Supabase tables created with correct constraints and RLS
- [x] All services work against Supabase when authenticated
- [x] All services fall back to local Expo SQLite when anonymous/offline
- [x] `SyncService` queues a write when offline and replays it when connectivity returns
- [x] Unit tests pass for all service methods

---

## Phase 3: Home Screen

**Goal:** The main screen shows 3 habit cards with today's completion status, the Gold Bolt counter, and navigation to Settings / Reward Shop.

**Duration:** 3–4 days  
**Depends on:** Phase 2

### Tasks

| #   | Task                         | Details                                                                                      |
| :-- | :--------------------------- | :------------------------------------------------------------------------------------------- |
| 3.1 | Build app shell              | Scaffold with custom app bar (child name, bolt counter, gear icon)                           |
| 3.2 | Build `HabitCard` component  | Shows habit icon, name, timer, completion status (✅ or "Not done")                          |
| 3.3 | Create habit definitions     | Constant list of 3 habits with `id`, `name`, `icon`, `defaultTimer`                          |
| 3.4 | Fetch today's logs           | Zustand selector that loads today's `habits_log` entries                                     |
| 3.5 | Show completion state        | Cross-reference today's logs with habit definitions → mark cards                             |
| 3.6 | Build bolt counter component | Animated 🔩 counter in the app bar                                                           |
| 3.7 | Add navigation               | Tapping a habit card → Mission screen (Phase 4). Gear → Settings. Reward icon → Reward Shop. |
| 3.8 | Style & theme                | Apply Fredoka One headings, Nunito body, vibrant toddler-friendly colors, rounded cards      |
| 3.9 | Add daily progress indicator | Construction caution-tape style progress bar (0/3, 1/3, 2/3, 3/3)                            |

### Acceptance Criteria

- [x] Home screen displays 3 habit cards
- [x] Cards show correct completion status based on today's logs
- [x] Gold Bolt counter shows correct balance
- [x] Daily progress bar updates as habits are completed
- [x] Navigation to Mission, Settings, and Reward Shop works
- [x] UI is vibrant, playful, and uses the correct fonts

---

## Phase 4: Mission Flow ⭐ (Core Feature)

**Goal:** The complete mission experience — buddy state machine, timer, programmatic Reanimated animations, layered audio, and mission result logging.

**Duration:** 8–12 days  
**Depends on:** Phase 3

> ⭐ **This is the most critical phase.** It contains the core value of the app.

### Sub-Phase 4A: Mission Screen & Timer (3–4 days)

| #    | Task                        | Details                                                                  |
| :--- | :-------------------------- | :----------------------------------------------------------------------- |
| 4A.1 | Build Mission screen layout | Buddy area (top 60%), timer + controls (bottom 40%)                      |
| 4A.2 | Implement countdown timer   | Configurable duration, visual ring/bar, countdown text (MM:SS)           |
| 4A.3 | Timer adjustment UI         | ±30s buttons before mission start (min 30s, max 30 min)                  |
| 4A.4 | "Start Mission" button      | Large, green, child-friendly. Starts timer + transitions buddy to ACTIVE |
| 4A.5 | "Done!" button              | Large, gold. Appears after mission starts. Stops timer → SUCCESS         |
| 4A.6 | Timer expiration            | Timer reaches 0:00 → SLEEPY state (PRD FR-MISSION-06)                    |
| 4A.7 | Mute toggle                 | Icon button to mute/unmute all audio                                     |
| 4A.8 | App lifecycle handling      | Pause timer on background, resume on foreground (PRD §9)                 |
| 4A.9 | Double-tap prevention       | Disable "Done!" button after first tap (PRD §9)                          |

### Sub-Phase 4B: Buddy State Machine (2–3 days)

| #    | Task                      | Details                                                                   |
| :--- | :------------------------ | :------------------------------------------------------------------------ |
| 4B.1 | Define `BuddyState` enum  | `idle`, `active`, `success`, `sleepy`                                     |
| 4B.2 | Build `BuddyStateMachine` | Zustand store managing state transitions (PRD §5.2)                       |
| 4B.3 | Define valid transitions  | `idle→active` (start), `active→success` (done), `active→sleepy` (timeout) |
| 4B.4 | Connect to timer          | Timer events trigger state transitions                                    |
| 4B.5 | Unit tests                | Test all state transitions, invalid transition rejection                  |

### Sub-Phase 4C: Reanimated Integration (2–3 days)

| #    | Task                          | Details                                                                           |
| :--- | :---------------------------- | :-------------------------------------------------------------------------------- |
| 4C.1 | Add static buddy + props      | Setup animal and prop images from Kenney Animal/Food/UI packs                     |
| 4C.2 | Build `BuddyAnimation`        | Animated.View component driven by `BuddyState` (translates/scales based on state) |
| 4C.3 | Setup Floating Prop component | Animated.Image that triggers when state is ACTIVE `habitType`                     |
| 4C.4 | Add Particle Effects          | Render confetti or stars when state is SUCCESS                                    |
| 4C.5 | Handle animation load failure | Show static fallback PNG if main buddy fails to load (PRD §9)                     |

### Sub-Phase 4D: Audio System (2–3 days)

| #    | Task                  | Details                                                            |
| :--- | :-------------------- | :----------------------------------------------------------------- |
| 4D.1 | Build `AudioService`  | Manages background music + VO + SFX layers independently           |
| 4D.2 | Background music      | Loop "Work Time" or "Moonlight" based on time of day. Fade in/out. |
| 4D.3 | Voice-over playback   | Play VO clips at trigger points (start, 50%, 25%, success, sleepy) |
| 4D.4 | Layered audio         | Music continues while VO plays on top (PRD FR-AUDIO-01/02)         |
| 4D.5 | SFX playback          | Button taps, bolt earned, timer warning                            |
| 4D.6 | Mute support          | Global mute toggle pauses all audio channels                       |
| 4D.7 | Respect silent mode   | Check device ringer/silent mode (PRD FR-AUDIO-05)                  |
| 4D.8 | Add placeholder audio | Use free CC0 clips for development; swap in finals later           |

### Sub-Phase 4E: Mission Result & Logging (1–2 days)

| #    | Task                        | Details                                                         |
| :--- | :-------------------------- | :-------------------------------------------------------------- |
| 4E.1 | Build Mission Result screen | Shows SUCCESS (bolt earned animation) or SLEEPY (encouragement) |
| 4E.2 | Log completion              | Write to `habits_log` with status, duration, bolts earned       |
| 4E.3 | Update bolt balance         | Increment `profiles.bolt_balance` on success                    |
| 4E.4 | Auto-return to Home         | After 4-second delay, navigate back to Home (PRD §10, step 9)   |
| 4E.5 | Gold Bolt animation         | Animated "+1 🔩" on success screen                              |

### Acceptance Criteria

- [ ] Full mission flow works: Start → Active (timer running) → Done → Success → Home
- [ ] Full mission flow works: Start → Active (timer running) → Timer expires → Sleepy → Home
- [ ] Timer pauses on app background, resumes on foreground
- [ ] Buddy component animates correctly for each state (even with placeholder)
- [ ] Background music loops, VO plays on top, SFX triggers on events
- [ ] Mute toggle works for all audio
- [ ] Mission result is logged to `habits_log`
- [ ] Bolt balance updates on success
- [ ] "Done!" button disabled after first tap
- [ ] Fallback image shown if image asset fails

---

## Phase 5: Reward System

**Goal:** Parents can create coupons. Children can "buy" real-world rewards with Gold Bolts.

**Duration:** 3–4 days  
**Depends on:** Phase 4 (bolt balance must be working)

### Tasks

| #   | Task                             | Details                                                                  |
| :-- | :------------------------------- | :----------------------------------------------------------------------- |
| 5.1 | Build Reward Shop screen         | List of available coupons, bolt balance at top, "Redeem" buttons         |
| 5.2 | Build Coupon Card component      | Title, bolt cost, redeem button (disabled if insufficient bolts)         |
| 5.3 | Redeem flow                      | Tap "Redeem" → confirmation dialog → deduct bolts → mark coupon redeemed |
| 5.4 | Redeemed history                 | Expandable section or tab showing previously redeemed coupons            |
| 5.5 | Build Coupon Management (parent) | CRUD interface under Settings: add coupon (title + cost), edit, delete   |
| 5.6 | Empty state                      | "No rewards yet — ask a parent to add some!" message                     |
| 5.7 | Bolt balance validation          | Prevent redemption if `balance < bolts_required` (PRD §9)                |

### Acceptance Criteria

- [ ] Parent can create a coupon with title and bolt cost
- [ ] Parent can edit and delete coupons
- [ ] Reward Shop shows available coupons with correct bolt costs
- [ ] "Redeem" button disabled when bolt balance is insufficient
- [ ] Redemption deducts bolts and marks coupon as redeemed
- [ ] Redeemed coupons appear in history
- [ ] Confirmation dialog prevents accidental redemption

---

## Phase 6: Parent Dashboard

**Goal:** Parents can see today's progress, a 7-day streak, and bolt statistics.

**Duration:** 2–3 days  
**Depends on:** Phase 4 (habits_log must be populated)

### Tasks

| #   | Task                   | Details                                                             |
| :-- | :--------------------- | :------------------------------------------------------------------ |
| 6.1 | Build Dashboard screen | Accessible from Home screen (tab or icon)                           |
| 6.2 | Today's summary        | List of 3 habits with ✅/❌ status for today                        |
| 6.3 | 7-day streak calendar  | Row of 7 day circles: filled = all habits done, hollow = incomplete |
| 6.4 | Bolt stats             | Total earned (all time), total spent, current balance               |
| 6.5 | Query optimization     | Efficient queries for streak data (last 7 days of `habits_log`)     |

### Acceptance Criteria

- [ ] Dashboard shows accurate today's habit status
- [ ] 7-day streak calendar renders correctly with accurate data
- [ ] Bolt statistics are correct (earned, spent, balance)
- [ ] Screen loads in < 1 second

---

## Phase 7: Offline & Sync

**Goal:** The app works fully offline and syncs seamlessly when connectivity returns.

**Duration:** 3–5 days  
**Depends on:** Phase 2 (SyncService foundation), Phase 5 (coupon sync)

### Tasks

| #   | Task                             | Details                                                                        |
| :-- | :------------------------------- | :----------------------------------------------------------------------------- |
| 7.1 | Offline detection UI             | Subtle banner: "Offline — data will sync when connected" (PRD §9)              |
| 7.2 | Offline mission completion       | Missions complete and log to local DB when offline                             |
| 7.3 | Sync queue                       | Queue all local writes (habit logs, bolt updates, coupon redemptions)          |
| 7.4 | Background sync                  | When connectivity restored, replay queued writes to Supabase, in order         |
| 7.5 | Conflict resolution              | Last-write-wins for simple fields. Additive merge for habit logs.              |
| 7.6 | Data migration on sign-in        | Anonymous→Authenticated: migrate local data to Supabase (PRD FR-AUTH-03)       |
| 7.7 | Migration error handling         | Retry 3x, keep local data on failure, show "Sync failed" message (PRD §9)      |
| 7.8 | Supabase real-time subscriptions | Listen for remote changes to `habits_log` and `profiles` for multi-device sync |
| 7.9 | Integration tests                | Simulate offline→online transitions, verify data integrity                     |

### Acceptance Criteria

- [ ] App functions fully offline (missions, rewards, dashboard)
- [ ] Offline banner appears/disappears based on connectivity
- [ ] Queued writes sync correctly when connectivity returns
- [ ] Anonymous → Authenticated migration preserves all data
- [ ] Migration failure is handled gracefully (retry + user message)
- [ ] Multi-device real-time sync works (change on Device A appears on Device B within 2s)

---

## Phase 8: Polish, Testing & Release Prep

**Goal:** The app is production-ready — polished UX, all error states handled, accessible, performant, and store-ready.

**Duration:** 5–7 days  
**Depends on:** All previous phases

### Sub-Phase 8A: UI Polish (2–3 days)

| #    | Task                     | Details                                                                      |
| :--- | :----------------------- | :--------------------------------------------------------------------------- |
| 8A.1 | Splash screen            | Animated Animal logo using Reanimated (or static fallback), 2-second minimum |
| 8A.2 | App icon                 | Generate iOS + Android icons from 1024×1024 master                           |
| 8A.3 | Color palette refinement | Vibrant, toddler-friendly palette. Test on tablet screens.                   |
| 8A.4 | Micro-animations         | Button press feedback, bolt counter increment, card completion check-mark    |
| 8A.5 | Loading states           | Skeleton screens or playful loading indicators (bouncing buddy?)             |
| 8A.6 | Empty states             | Friendly illustrations for empty reward shop, no logs, etc.                  |
| 8A.7 | Responsive layout        | Test on phone (small), tablet (large), landscape + portrait                  |

### Sub-Phase 8B: Error Handling & Edge Cases (1–2 days)

| #    | Task                   | Details                                                      |
| :--- | :--------------------- | :----------------------------------------------------------- |
| 8B.1 | Audit all error states | Walk through PRD §9 checklist — verify each is handled       |
| 8B.2 | Global error boundary  | Catch unhandled exceptions, log them, show friendly fallback |
| 8B.3 | Network error handling | Supabase request failures → graceful fallback to local data  |
| 8B.4 | Input validation       | Child name length, coupon title length, bolt cost range      |

### Sub-Phase 8C: Accessibility (1 day)

| #    | Task             | Details                                                                                     |
| :--- | :--------------- | :------------------------------------------------------------------------------------------ |
| 8C.1 | Tap target audit | All buttons ≥ 48×48dp                                                                       |
| 8C.2 | Semantics labels | Add `Semantics` widgets to parent-facing screens for screen readers                         |
| 8C.3 | Reduce Motion    | Check `AccessibilityInfo.isReduceMotionEnabled()` — disable bouncy Reanimated loops if true |
| 8C.4 | Color contrast   | Verify WCAG AA contrast on all parent-facing text                                           |

### Sub-Phase 8D: Testing (1–2 days)

| #    | Task                  | Details                                                        |
| :--- | :-------------------- | :------------------------------------------------------------- |
| 8D.1 | Unit tests            | Models, repositories, state machine, services                  |
| 8D.2 | Component tests       | Key screens: Home, Mission, Reward Shop                        |
| 8D.3 | Integration tests     | Full mission flow (start → done → bolt awarded → home updated) |
| 8D.4 | Manual QA             | Test on real iOS device + real Android device                  |
| 8D.5 | Performance profiling | Check FPS during Reanimated animations, cold start time        |

### Sub-Phase 8E: Release Prep (1 day)

| #    | Task                    | Details                                                                 |
| :--- | :---------------------- | :---------------------------------------------------------------------- |
| 8E.1 | Privacy Policy          | Draft and host (e.g., GitHub Pages). Link in app Settings.              |
| 8E.2 | App Store metadata      | Screenshots, app description, keywords, age rating (4+)                 |
| 8E.3 | COPPA compliance review | Final audit: no child data collected, no tracking SDKs, VOs pre-bundled |
| 8E.4 | Build release APK/IPA   | `eas build --platform android` + `eas build --platform ios`             |
| 8E.5 | Submit to stores        | Google Play Console + Apple App Store Connect                           |

### Acceptance Criteria

- [ ] App cold start < 3 seconds
- [ ] Reanimated routines ≥ 60 FPS on mid-range device
- [ ] All PRD §9 error states handled
- [ ] All tap targets ≥ 48×48dp
- [ ] Screen reader works on parent-facing screens
- [ ] Privacy policy accessible in-app
- [ ] Release builds succeed for both platforms
- [ ] All tests pass
- [ ] Manual QA complete on real devices

---

## Phase Summary

| Phase | Name                      | Duration  | Depends On | Status         |
| :---- | :------------------------ | :-------- | :--------- | :------------- |
| 0     | Project Scaffolding       | 2–3 days  | —          | ✅ Complete    |
| 1     | Auth & Onboarding         | 3–5 days  | Phase 0    | ✅ Complete    |
| 2     | Core Data Layer           | 4–5 days  | Phase 1    | ✅ Complete    |
| 3     | Home Screen               | 3–4 days  | Phase 2    | ✅ Complete    |
| 4     | Mission Flow ⭐           | 8–12 days | Phase 3    | ⬜ Not Started |
| 5     | Reward System             | 3–4 days  | Phase 4    | ⬜ Not Started |
| 6     | Parent Dashboard          | 2–3 days  | Phase 4    | ⬜ Not Started |
| 7     | Offline & Sync            | 3–5 days  | Phase 2, 5 | ⬜ Not Started |
| 8     | Polish, Testing & Release | 5–7 days  | All        | ⬜ Not Started |

> **Note:** Phases 5 and 6 can run in parallel since they're independent of each other. Phase 7 depends on Phase 5 (coupon sync).

---

## Asset Production Timeline

Assets can be produced **in parallel** with development. Here's when each asset type is needed:

| Asset                 | Needed By                                 | Blocking?                           |
| :-------------------- | :---------------------------------------- | :---------------------------------- |
| 🎨 Animal & Prop PNGs | Phase 4C (can use placeholder until then) | No — placeholder OK                 |
| 🎵 Music loops        | Phase 4D (can use placeholder until then) | No — placeholder OK                 |
| 🔊 Sound effects      | Phase 4D                                  | No — placeholder OK                 |
| 🗣️ Voice-over clips   | Phase 4D                                  | No — placeholder OK                 |
| 🖼️ App icon & splash  | Phase 8A                                  | No — only needed for release        |
| 📝 Privacy policy     | Phase 8E                                  | Yes — required for store submission |

> **Strategy:** Use placeholder assets (simple shapes, royalty-free audio) through Phases 0–7. Swap in production Kenney assets during Phase 8A. This avoids blocking development on asset creation.

## Risk Register

| Risk                                                 | Impact | Likelihood | Mitigation                                                                                                                                                                        |
| :--------------------------------------------------- | :----- | :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reanimated math complexity                           | Medium | Low        | Start with simple bounces. Use `withSpring` for everything toddler-friendly. Adjust scaling and translates slowly.                                                                |
| ElevenLabs free tier character limit                 | Low    | Medium     | Pre-write all VO scripts (PRD lists ~6 lines ≈ 300 chars). Free tier allows 10k chars — plenty for MVP.                                                                           |
| Apple OAuth requires paid developer account ($99/yr) | Medium | Certain    | Budget for Apple Developer Program. Required for TestFlight and App Store anyway.                                                                                                 |
| Supabase free tier limits                            | Low    | Low        | Free tier: 500MB DB, 1GB storage, 2GB bandwidth. More than enough for MVP.                                                                                                        |
| Offline sync conflicts                               | Medium | Medium     | Keep conflict resolution simple (last-write-wins). Habit logs are append-only, so conflicts are rare.                                                                             |
| App Store rejection (children's category)            | High   | Medium     | Follow COPPA strictly. No ads, no tracking, no user-generated content from children. Review Apple's [Kids Category guidelines](https://developer.apple.com/app-store/kids-apps/). |

---

## Definition of Done (MVP)

The MVP is complete when:

- [ ] All 8 phases are marked ✅ Complete
- [ ] A parent can: sign in, create a profile, run all 3 missions, earn bolts, create coupons, and redeem rewards
- [ ] The app works offline and syncs when reconnected
- [ ] Buddy character animates correctly for all 4 states × 3 habits
- [ ] Audio plays correctly (music + VO layered)
- [ ] Parent Dashboard shows accurate daily progress and streak
- [ ] All PRD §9 error states are handled
- [ ] App passes COPPA compliance review
- [ ] Release builds submitted to Google Play and Apple App Store
