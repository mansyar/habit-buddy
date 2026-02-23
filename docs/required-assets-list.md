# 🛠️ HabitBuddy Asset Checklist (MVP — Animal Only)

> Aligned with PRD v2.0. Secondary buddy assets (e.g., Bear) are deferred to v1.1.

---

## 1. Buddy & Prop Image Assets (🟢 Green Monster / Animal)

> **Format:** High-quality static PNGs or SVGs. Animations will be programmatic via Reanimated.  
> **Source:** [Kenney.nl](https://kenney.nl/) (Animal Pack or similar free CC0 pack)

| #   | Asset                       | Usage                                | Source                        |
| :-- | :-------------------------- | :----------------------------------- | :---------------------------- |
| [ ] | Green Monster / Animal Base | Main buddy character image           | Kenney Animal Pack            |
| [ ] | Toothbrush Prop             | Floats during `brush_teeth` mission  | Kenney or custom CC0          |
| [ ] | Plate / Apple Prop          | Floats during `eat_meal` mission     | Kenney Food Pack              |
| [ ] | Toy Box / Bear Prop         | Floats during `pick_up_toys` mission | Kenney or custom CC0          |
| [ ] | Confetti / Star Particles   | Particle effect on `SUCCESS` state   | React Native library / Lottie |

**Total: 1 main character image + 3 prop images**

---

## 2. UI Visual Assets (from Kenney.nl — CC0)

| #   | Asset                                  | Usage                               | Source            |
| :-- | :------------------------------------- | :---------------------------------- | :---------------- |
| [ ] | "Start Mission" button (large, green)  | Mission screen                      | Kenney UI Pack    |
| [ ] | "Done!" button (large, gold/yellow)    | Mission screen — active state       | Kenney UI Pack    |
| [ ] | Gold Bolt icon (🔩)                    | Currency display, reward animations | Kenney Game Icons |
| [ ] | Checkmark / Complete icon (✅)         | Habit card — completed state        | Kenney UI Pack    |
| [ ] | Timer ring / progress circle           | Mission screen countdown            | Custom or Kenney  |
| [ ] | Habit card icons (🪥 🍽️ 🧸)            | Home screen habit cards             | Kenney or custom  |
| [ ] | Mute / Unmute toggle icon              | Mission screen                      | Kenney UI Pack    |
| [ ] | Settings gear icon                     | Home screen → Settings              | Kenney UI Pack    |
| [ ] | Construction caution-tape progress bar | Home screen daily progress          | Custom styled     |
| [ ] | Coupon / ticket illustration           | Reward Shop items                   | Kenney or custom  |

---

## 3. Audio Assets

### 3.1 Music Loops (bundled with app)

| #   | Track       | Mood                     | Usage                      | Duration     | Source                        |
| :-- | :---------- | :----------------------- | :------------------------- | :----------- | :---------------------------- |
| [ ] | "Work Time" | Upbeat, percussion-heavy | Morning / daytime missions | 1–2 min loop | freesound.org (CC0) or custom |
| [ ] | "Moonlight" | Soft, piano/synth        | Evening / night missions   | 1–2 min loop | freesound.org (CC0) or custom |

### 3.2 Sound Effects

| #   | SFX                         | Trigger                    | Source              |
| :-- | :-------------------------- | :------------------------- | :------------------ |
| [ ] | Mission start chime         | "Start Mission" button tap | freesound.org (CC0) |
| [ ] | Gold Bolt earned jingle     | Mission success            | freesound.org (CC0) |
| [ ] | Button tap feedback         | Any button press           | freesound.org (CC0) |
| [ ] | Timer warning (gentle tick) | Last 10 seconds of timer   | freesound.org (CC0) |
| [ ] | Sleepy/fail soft tone       | Timer expires              | freesound.org (CC0) |
| [ ] | Coupon redeemed fanfare     | Reward redemption          | freesound.org (CC0) |

### 3.3 Voice Overs (ElevenLabs — pre-generated, bundled)

> **Voice profile:** "Friendly Adult" or "Young Hero"  
> **⚠️ COPPA:** All VOs are pre-rendered. No child data sent to APIs at runtime.

| #   | Line ID          | Script                                             | Trigger         |
| :-- | :--------------- | :------------------------------------------------- | :-------------- |
| [ ] | `vo_intro`       | "Hey! Are you ready for our mission?"              | Mission start   |
| [ ] | `vo_encourage_1` | "Almost there! Keep going!"                        | Timer at 50%    |
| [ ] | `vo_encourage_2` | "You're doing amazing!"                            | Timer at 25%    |
| [ ] | `vo_success`     | "Mission Accomplished! You earned a Gold Bolt!"    | Mission success |
| [ ] | `vo_sleepy`      | "I'm getting so sleepy… let's try again tomorrow." | Timer expires   |
| [ ] | `vo_reward`      | "Wow! You redeemed a reward! Great job!"           | Coupon redeemed |

---

## 4. Static Fallback Images (Error Handling)

> Used if primary image assets fail to load.

| #   | Asset                | Description                                   |
| :-- | :------------------- | :-------------------------------------------- |
| [ ] | `buddy_fallback.png` | Static illustration of Buddy, smiling         |
| [ ] | `app_icon.png`       | App icon for iOS & Android (1024×1024 master) |
| [ ] | `splash_logo.png`    | Logo/illustration for splash screen           |

---

## 5. Typography & Font

| #   | Font                                               | Usage                              | Source             |
| :-- | :------------------------------------------------- | :--------------------------------- | :----------------- |
| [ ] | **Fredoka One** (or similar rounded, playful font) | Headings, habit names, button text | Google Fonts (OFL) |
| [ ] | **Nunito** (or similar friendly sans-serif)        | Body text, parent-facing UI        | Google Fonts (OFL) |

---

## 6. Post-MVP Assets (v1.1 — Bear Buddy)

> **Do not create these yet.** Listed for future planning.

| #   | Asset                                          | Notes                     |
| :-- | :--------------------------------------------- | :------------------------ |
| [ ] | Bear Animal Base Image                         | Alternate buddy character |
| [ ] | Bear VO lines (same scripts, different voice?) | TBD                       |
