# Product Requirement Document: HabitBuddy

**Version:** 2.0  
**Status:** Refined & Ready for Implementation Planning  
**Last Updated:** 2026-02-20

---

## 1. Product Vision

Transform daily routines from "chores" into "missions" for young children (ages 3–5) by leveraging their love for cute animals and monsters. A parent-mediated mobile app where the parent drives the experience while the child watches their animated Buddy complete missions alongside them.

---

## 2. Target Users

| Role       | Description                                                                                 | Interaction Model                          |
| :--------- | :------------------------------------------------------------------------------------------ | :----------------------------------------- |
| **Parent** | Primary user. Configures habits, initiates missions, taps "Done", manages rewards.          | Full UI interaction                        |
| **Child**  | Ages 3–5. Watches the Buddy animate, hears voice-overs, participates in the physical habit. | Passive viewer / occasional big-button tap |

> **Design principle:** The parent is always in control. The child should never need to navigate menus, read text, or make app-level decisions.

---

## 3. Platform & Tech Stack

### 3.1 Platform: Mobile-First (iOS + Android)

React Native (Expo) builds for iOS and Android. No PWA or web build in the MVP.

**Rationale:** Toddler apps live on tablets and phones. Smooth programmatic animations (via React Native Reanimated) and layered audio perform best on native platforms. Web/PWA can be considered post-MVP.

### 3.2 Tech Stack (Cost: ~$30 for Dev)

| Component           | Tool                   | License                 | Purpose                                                                                                 |
| :------------------ | :--------------------- | :---------------------- | :------------------------------------------------------------------------------------------------------ |
| **Framework**       | React Native + Expo    | Open Source (MIT)       | Cross-platform mobile UI                                                                                |
| **Database / Auth** | Supabase               | Open Source / Free Tier | Data sync, OAuth, real-time subscriptions                                                               |
| **Animation**       | Reanimated             | Open Source (MIT)       | Code-driven programmatic animations (bounces, floats) using Kenney.nl static assets and floating props. |
| **Icons / Art**     | Kenney.nl              | Public Domain (CC0)     | UI elements, buttons, progress bars                                                                     |
| **Voice Overs**     | ElevenLabs             | Free Tier (10k chars)   | Friendly character voice lines                                                                          |
| **Audio / Music**   | freesound.org / custom | CC0 / CC-BY             | Background music loops                                                                                  |

---

## 4. MVP Scope

### 4.1 Buddies

| Buddy                        | MVP              | Post-MVP (v1.1)         |
| :--------------------------- | :--------------- | :---------------------- |
| 🟢 **Green Monster/Animal**  | ✅ Ship with MVP | —                       |
| 🐻 **Another Animal (Bear)** | ❌ Not in MVP    | ✅ First content update |

The buddy requires the following animation states per habit (see §5.2).

### 4.2 Habits (Fixed Set — 3 Habits)

| Habit ID       | Display Name     | Icon | Typical Time           |
| :------------- | :--------------- | :--- | :--------------------- |
| `brush_teeth`  | Brush Your Teeth | 🪥   | Morning & Night        |
| `eat_meal`     | Eat Your Meal    | 🍽️   | Morning, Lunch, Dinner |
| `pick_up_toys` | Pick Up Toys     | 🧸   | Anytime                |

> **MVP constraint:** These 3 habits are hardcoded. Each has unique buddy animations and voice-over lines. Custom/additional habits are a post-MVP feature.

### 4.3 Reward System — Coupon / Real-World Rewards

| Concept             | Description                                                                               |
| :------------------ | :---------------------------------------------------------------------------------------- |
| **Currency**        | 🔩 **Gold Bolts** — earned by completing missions                                         |
| **Earning rate**    | 1 Gold Bolt per completed mission                                                         |
| **Coupon**          | A parent-defined real-world reward (e.g., "Extra story time", "Pick a snack")             |
| **Redemption**      | Parent sets a bolt cost per coupon (e.g., 5 bolts). Child "buys" it with parent approval. |
| **Motivation loop** | Complete missions → Earn bolts → Redeem for real rewards → Want to do more missions       |

---

## 5. Functional Requirements

### 5.1 Authentication (FR-AUTH)

| ID         | Requirement                                                                                                            |
| :--------- | :--------------------------------------------------------------------------------------------------------------------- |
| FR-AUTH-01 | The app must support **anonymous/local-only mode** for first-run. No sign-up required to try the app.                  |
| FR-AUTH-02 | The app must support **OAuth sign-in** via Google and Apple (Supabase Auth).                                           |
| FR-AUTH-03 | When a user signs in after using anonymous mode, their local data must be **migrated** to their authenticated account. |
| FR-AUTH-04 | Auth tokens must be stored securely using Expo SecureStore.                                                            |

### 5.2 Buddy State Machine (FR-BUDDY)

The buddy operates as a finite state machine with 4 states per habit using React Native Reanimated code animations:

```
 ┌─────────────┐   Parent taps    ┌──────────────┐
 │    IDLE     │ ──"Start Mission"──▶│    ACTIVE    │
 │ (floating)  │                  │  (bouncing   │
 └─────────────┘                  │  with prop)  │
                                  └──────┬───────┘
                                         │
                           ┌─────────────┴─────────────┐
                     Parent taps               Timer expires
                    "Done" button             (no interaction)
                          │                          │
                    ┌─────▼─────┐              ┌─────▼──────┐
                    │  SUCCESS  │              │   SLEEPY   │
                    │ (jumping) │              │ (swaying)  │
                    └───────────┘              └────────────┘
```

| ID          | Requirement                                                                                                                                                         |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-BUDDY-01 | **Idle state:** Buddy floats gently up and down (looping Reanimated `translateY`). Displayed on the mission screen before start.                                    |
| FR-BUDDY-02 | **Active state:** Buddy bounces excitedly (Reanimated `scale`/spring). A habit-specific prop (e.g., a toothbrush) floats and animates in front of them.             |
| FR-BUDDY-03 | **Success state:** Buddy performs a "Victory Jump" (massive `translateY` + 360 `rotateZ`) with confetti particles and celebratory audio. Displayed for 3–5 seconds. |
| FR-BUDDY-04 | **Sleepy state:** Buddy scales down slightly (`scale: 0.9`) and sways (`rotateZ`). Screen tints dark blue. Triggered when the mission timer expires.                |
| FR-BUDDY-05 | Each habit must display a unique floating PNG prop alongside the bouncing Buddy in the Active state (e.g., Toothbrush, Meal, Toys).                                 |

### 5.3 Audio Management (FR-AUDIO)

| ID          | Requirement                                                                                                                                                                                     |
| :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-AUDIO-01 | **Background music** must loop continuously during missions. Two tracks: "Work Time" (upbeat, morning) and "Moonlight" (soft, night).                                                           |
| FR-AUDIO-02 | **Voice-over cues** must play on top of background music without pausing it (layered audio).                                                                                                    |
| FR-AUDIO-03 | Voice-over lines: Intro ("Hey! Are you ready for our mission?"), Encouragement ("Almost there!"), Success ("Mission Accomplished! You earned a Gold Bolt!"), Sleepy ("I'm getting so sleepy…"). |
| FR-AUDIO-04 | Parent must be able to **mute/unmute** all audio from the mission screen.                                                                                                                       |
| FR-AUDIO-05 | Audio must respect the device's silent/vibrate mode.                                                                                                                                            |

### 5.4 Mission Flow (FR-MISSION)

| ID            | Requirement                                                                                               |
| :------------ | :-------------------------------------------------------------------------------------------------------- |
| FR-MISSION-01 | Parent selects a habit from the home screen to start a mission.                                           |
| FR-MISSION-02 | The mission screen shows: Buddy animation, habit name, timer (countdown), "Done" button, and mute toggle. |
| FR-MISSION-03 | Mission timer defaults: Brush Teeth = 2 min, Eat Meal = 15 min, Pick Up Toys = 5 min.                     |
| FR-MISSION-04 | Parent can optionally adjust the timer before starting (±30s increments, min 30s, max 30 min).            |
| FR-MISSION-05 | Tapping "Done" before timer expires → Success state.                                                      |
| FR-MISSION-06 | Timer reaching zero → Sleepy state (no bolt awarded, gentle encouragement).                               |
| FR-MISSION-07 | A completed mission logs an entry to the `habits_log` table (or local storage if offline).                |

### 5.5 Reward System (FR-REWARD)

| ID           | Requirement                                                                                   |
| :----------- | :-------------------------------------------------------------------------------------------- |
| FR-REWARD-01 | Each successful mission awards **1 Gold Bolt**.                                               |
| FR-REWARD-02 | Parent can create, edit, and delete **Coupons** (title + bolt cost).                          |
| FR-REWARD-03 | The Reward Shop screen displays available coupons with their bolt cost and a "Redeem" button. |
| FR-REWARD-04 | Redemption requires parent confirmation (e.g., a simple "Are you sure?" dialog).              |
| FR-REWARD-05 | Redeemed coupons are marked as used and appear in a history list.                             |
| FR-REWARD-06 | The child's current Gold Bolt balance is displayed on the home screen and reward shop.        |

### 5.6 Multi-Device Sync (FR-SYNC)

| ID         | Requirement                                                                                    |
| :--------- | :--------------------------------------------------------------------------------------------- |
| FR-SYNC-01 | When authenticated, habit completions and bolt balances must sync across devices via Supabase. |
| FR-SYNC-02 | Supabase real-time subscriptions must update the UI within 2 seconds of a remote change.       |
| FR-SYNC-03 | Offline completions must be queued locally and synced when connectivity is restored.           |

### 5.7 Parent Dashboard (FR-DASHBOARD)

| ID         | Requirement                                                                                    |
| :--------- | :--------------------------------------------------------------------------------------------- |
| FR-DASH-01 | Show a summary of today's completed and pending habits.                                        |
| FR-DASH-02 | Show a 7-day streak calendar (which days had all habits completed).                            |
| FR-DASH-03 | Show total Gold Bolts earned and spent.                                                        |
| FR-DASH-04 | Access to child profile settings (name, buddy selection — post-MVP when Constructor is added). |

---

## 6. Screen Inventory

| #   | Screen                     | Key Elements                                                               | Access                  |
| :-- | :------------------------- | :------------------------------------------------------------------------- | :---------------------- |
| 1   | **Splash / Loading**       | App logo, animated logo                                                    | Auto on launch          |
| 2   | **Onboarding (first-run)** | Child name input, buddy intro animation                                    | First launch only       |
| 3   | **Home / Mission Select**  | 3 habit cards (with status), Gold Bolt counter, settings gear icon         | Main screen             |
| 4   | **Mission Active**         | Buddy animation, timer, "Done" button, mute toggle                         | From habit card tap     |
| 5   | **Mission Result**         | Success or Sleepy state, bolt earned (if success), "Back to Home"          | After mission ends      |
| 6   | **Reward Shop**            | Coupon list, bolt balance, redeem buttons                                  | From home screen        |
| 7   | **Parent Settings**        | Profile management, coupon CRUD, sign-in/out, timer defaults, audio toggle | From gear icon          |
| 8   | **Parent Dashboard**       | Today's summary, 7-day streak, bolt stats                                  | Tab or icon on home     |
| 9   | **Sign-In**                | Google / Apple OAuth buttons, "Continue without account" link              | From settings or prompt |

---

## 7. Data Model (Supabase)

### 7.1 Tables

```sql
-- Parent/account who owns the profile
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  child_name TEXT NOT NULL,
  child_age INTEGER CHECK (child_age BETWEEN 2 AND 7),
  selected_buddy TEXT NOT NULL DEFAULT 'dino' CHECK (selected_buddy IN ('dino', 'constructor')),
  timezone TEXT NOT NULL DEFAULT 'UTC',
  bolt_balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Log of every completed (or failed) mission
CREATE TABLE habits_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  habit_id TEXT NOT NULL CHECK (habit_id IN ('brush_teeth', 'eat_meal', 'pick_up_toys')),
  status TEXT NOT NULL CHECK (status IN ('success', 'sleepy')),
  duration_seconds INTEGER,  -- actual time spent
  timer_seconds INTEGER,     -- configured timer value
  bolts_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  synced BOOLEAN NOT NULL DEFAULT true  -- false if completed offline, awaiting sync
);

-- Parent-defined real-world rewards
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  bolts_required INTEGER NOT NULL CHECK (bolts_required > 0),
  is_redeemed BOOLEAN NOT NULL DEFAULT false,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 7.2 Row-Level Security (RLS)

All tables must have RLS enabled. Users can only read/write rows where `profiles.user_id = auth.uid()`.

### 7.3 Local Storage (Anonymous Mode)

When unauthenticated, the same schema is mirrored locally using **SQLite** (via `expo-sqlite`). On sign-in, local data is migrated to Supabase and the local DB is cleared.

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Metric                 | Target                                |
| :--------------------- | :------------------------------------ |
| App cold start         | < 3 seconds                           |
| Reanimated frame rate  | ≥ 60 FPS on mid-range devices (2022+) |
| Audio playback latency | < 200ms from trigger to sound         |
| Supabase sync latency  | < 2 seconds for real-time updates     |

### 8.2 Accessibility

| Requirement                                                                             |
| :-------------------------------------------------------------------------------------- |
| All buttons must have a minimum tap target of **48×48dp** (Material guidelines).        |
| High contrast between text/icons and backgrounds (WCAG AA for text visible to parents). |
| Support for screen readers on parent-facing screens (Settings, Dashboard).              |
| Animations must respect the device's "Reduce Motion" accessibility setting.             |

### 8.3 Privacy & COPPA Compliance

> ⚠️ **Critical:** Apps directed at children under 13 in the US must comply with [COPPA](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa). Similar regulations exist in the EU (GDPR-K) and Australia (Privacy Act).

| Requirement                                                                                                               |
| :------------------------------------------------------------------------------------------------------------------------ |
| **No personal data collection from children.** The child never inputs data — only the parent does.                        |
| **No third-party analytics or ad SDKs** that track children.                                                              |
| **Parent is the account holder.** All data is associated with the parent's auth account.                                  |
| **Privacy policy** must be displayed in the app and linked in App Store listings.                                         |
| **Parental consent** is implicitly granted by the parent creating the account/profile.                                    |
| If using ElevenLabs VO, voices must be **pre-generated and bundled** — no child data is sent to external APIs at runtime. |

### 8.4 Offline Capability

| Requirement                                                                                                |
| :--------------------------------------------------------------------------------------------------------- |
| All Buddy and prop image assets and audio files must be **bundled with the app** (not fetched at runtime). |
| Missions can be completed fully offline. Completions are queued in local storage.                          |
| When connectivity is restored, queued completions sync to Supabase automatically.                          |
| The Reward Shop is available offline (reads from local cache), but redemptions sync when online.           |

---

## 9. Error States & Edge Cases

| Scenario                               | Expected Behavior                                                                                |
| :------------------------------------- | :----------------------------------------------------------------------------------------------- |
| **Supabase is unreachable**            | App functions in offline mode. A subtle banner shows "Offline — data will sync when connected."  |
| **Image asset fails to load**          | Show a static fallback styling of the buddy. Log the error silently.                             |
| **Audio fails to play**                | Mission continues without audio. No error shown to the user.                                     |
| **App is backgrounded during mission** | Timer pauses. On return, mission resumes from where it was.                                      |
| **App is killed during mission**       | Mission is abandoned. No log entry is created. No bolt awarded.                                  |
| **Double-tap on "Done"**               | Button is disabled after the first tap to prevent duplicate completions.                         |
| **Bolt balance goes negative**         | Prevent redemption if balance < coupon cost. "Redeem" button is disabled.                        |
| **Data migration on sign-in fails**    | Retry 3 times. If still failing, keep local data and show "Sync failed — we'll try again later." |

---

## 10. User Flow: The "Morning Mission"

```
1. Parent opens HabitBuddy
2. Home screen shows 3 habit cards:
   - 🪥 Brush Teeth (⏱ 2:00) — Not done
   - 🍽️ Eat Meal (⏱ 15:00) — Not done
   - 🧸 Pick Up Toys (⏱ 5:00) — Not done
3. Parent taps "Brush Teeth" card
4. Mission screen loads:
   - 🟢 Buddy in IDLE state (floating)
   - Timer shows 2:00
   - "Start Mission" button
5. Parent taps "Start Mission"
   - Buddy transitions to ACTIVE state (bouncing with toothbrush prop)
   - Timer counts down: 1:59… 1:58…
   - VO plays: "Hey! Are you ready for our mission?"
   - Background music: "Work Time" loop
6. Child brushes teeth alongside Buddy
7. Parent taps "Done!" at 0:42 remaining
   - Buddy transitions to SUCCESS state (Victory Jump!)
   - VO: "Mission Accomplished! You earned a Gold Bolt!"
   - 🔩 +1 Gold Bolt animation
8. Result screen shows for 4 seconds
9. Auto-returns to Home screen
   - 🪥 Brush Teeth now shows ✅ Complete
   - Bolt counter: 🔩 1
10. habits_log entry created:
    { habit_id: "brush_teeth", status: "success",
      duration_seconds: 78, bolts_earned: 1 }
```

---

## 11. Out of Scope (Post-MVP)

| Feature                                   | Target Version |
| :---------------------------------------- | :------------- |
| Constructor (Excavator) buddy             | v1.1           |
| Custom / additional habits                | v1.2           |
| Child-facing UI (independent navigation)  | v1.2           |
| PWA / Web build                           | v1.3           |
| Buddy cosmetic upgrades (hats, colors)    | v1.3           |
| Multiple child profiles per account       | v1.2           |
| Notification reminders ("Time to brush!") | v1.1           |
| Weekly/monthly parent reports             | v1.2           |
| Localization / multi-language support     | v2.0           |

---

## 12. Success Metrics (MVP)

| Metric                      | Target                                                      |
| :-------------------------- | :---------------------------------------------------------- |
| **Mission completion rate** | ≥ 70% of started missions end in Success (not Sleepy)       |
| **Daily retention (Day 7)** | ≥ 40% of users active on Day 7                              |
| **Coupon creation rate**    | ≥ 50% of parents create at least 1 coupon within first week |
| **Crash-free sessions**     | ≥ 99.5%                                                     |
| **App Store rating**        | ≥ 4.5 stars                                                 |

---

## Appendix A: Animation Asset Requirements (MVP)

All animations are programmatic code animations operated via React Native Reanimated applied to high-quality static images (e.g., Kenney Animal pack).

| State   | Buddy Movement (Code)                 | Floating Prop (Static Image)      | Duration    |
| :------ | :------------------------------------ | :-------------------------------- | :---------- |
| IDLE    | Slow float up and down (`translateY`) | None                              | Continuous  |
| ACTIVE  | Fast spring bounce (`scale`)          | Depends on habit (see below)      | Match timer |
| SUCCESS | Jump & Spin (`translateY`, `rotateZ`) | General confetti/star particles   | 3–5 sec     |
| SLEEPY  | Sway (`rotateZ`), scale down slightly | None (Background tints dark blue) | 3–5 sec     |

**Props Needed per Habit:**

- `brush_teeth`: Toothbrush (rapid `rotateZ` wiggle)
- `eat_meal`: Plate / Fork / Apple (slow `rotateZ` or float)
- `pick_up_toys`: Toy Box / Teddy Bear (slow float)
