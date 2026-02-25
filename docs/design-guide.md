# HabitBuddy — Design Guide

**Version:** 1.0  
**Created:** 2026-02-20  
**Aligned with:** PRD v2.0

---

## 1. Design Philosophy

HabitBuddy is an app for **toddlers (3–5)** mediated by **parents**. The design must satisfy two competing needs:

| Audience   | Need                                           | Design Response                                                             |
| :--------- | :--------------------------------------------- | :-------------------------------------------------------------------------- |
| **Child**  | Captivating, delightful, can't-look-away       | Bold colors, large animated buddy, celebratory feedback, playful sounds     |
| **Parent** | Clear, trustworthy, easy to operate one-handed | Clean hierarchy, readable text, obvious tap targets, minimal cognitive load |

### Core Principles

1. **Joy first.** Every screen should feel like opening a toy box — colorful, surprising, rewarding.
2. **Big and bold.** Minimum 48dp tap targets. Large text. No small UI elements a toddler could accidentally trigger.
3. **Consistent feedback.** Every action gets a visual + audio response. The child should always know "something happened."
4. **Parent confidence.** Parent-facing UI (settings, dashboard) uses a calmer, more mature aesthetic while staying within the same color family.
5. **Accessibility by default.** High contrast, screen reader labels on parent screens, respect for "Reduce Motion" setting.

---

## 2. Color Palette

### 2.1 Primary Palette

The palette is warm, vibrant, and playful — inspired by children's picture books and toy packaging.

```
┌─────────────────────────────────────────────────────────────┐
│  BACKGROUND (Dark)                                          │
│  ┌──────────┐ ┌──────────┐                                  │
│  │ Deep     │ │ Night    │                                  │
│  │ Indigo   │ │ Purple   │                                  │
│  │ #1A1A2E  │ │ #16213E  │                                  │
│  └──────────┘ └──────────┘                                  │
│                                                             │
│  SURFACE (Cards, containers)                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│  │ Card     │ │ Card     │ │ Elevated │                     │
│  │ Dark     │ │ Medium   │ │ Surface  │                     │
│  │ #2A2A4A  │ │ #3A3A5C  │ │ #4A4A6A  │                     │
│  └──────────┘ └──────────┘ └──────────┘                     │
│                                                             │
│  ACCENT (Vibrant, child-facing)                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Dino     │ │ Mission  │ │ Reward   │ │ Sleepy   │       │
│  │ Green    │ │ Orange   │ │ Gold     │ │ Blue     │       │
│  │ #4ADE80  │ │ #FB923C  │ │ #FBBF24  │ │ #60A5FA  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                             │
│  STATUS                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│  │ Success  │ │ Warning  │ │ Error    │                     │
│  │ #22C55E  │ │ #EAB308  │ │ #EF4444  │                     │
│  └──────────┘ └──────────┘ └──────────┘                     │
│                                                             │
│  TEXT                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│  │ Primary  │ │ Secondary│ │ Muted    │                     │
│  │ #F8FAFC  │ │ #CBD5E1  │ │ #64748B  │                     │
│  └──────────┘ └──────────┘ └──────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Habit-Specific Colors

Each habit has its own accent color used on cards, timers, and buddy backgrounds:

| Habit           | Primary Color      | Light Tint (10% opacity) | Icon                |
| :-------------- | :----------------- | :----------------------- | :------------------ |
| 🪥 Brush Teeth  | `#4ADE80` (Green)  | `#4ADE801A`              | Toothbrush          |
| 🍽️ Eat Meal     | `#FB923C` (Orange) | `#FB923C1A`              | Plate with utensils |
| 🧸 Pick Up Toys | `#60A5FA` (Blue)   | `#60A5FA1A`              | Teddy bear          |

### 2.3 Dark Mode Only

The app uses a **dark mode design exclusively** for MVP. Rationale:

- Dark backgrounds make colorful buddy animations pop
- Easier on eyes for morning/evening routines
- Premium, modern feel that parents appreciate
- Reduces power consumption on OLED screens (tablets)

---

## 3. Typography

### 3.1 Font Families

| Font            | Usage                                     | Weight                                    | Source                                                        |
| :-------------- | :---------------------------------------- | :---------------------------------------- | :------------------------------------------------------------ |
| **Fredoka One** | Headings, habit names, buttons, hero text | Bold (700)                                | [Google Fonts](https://fonts.google.com/specimen/Fredoka+One) |
| **Nunito**      | Body text, descriptions, parent-facing UI | Regular (400), SemiBold (600), Bold (700) | [Google Fonts](https://fonts.google.com/specimen/Nunito)      |

### 3.2 Type Scale

| Token          | Font        | Size | Weight | Line Height | Usage                                 |
| :------------- | :---------- | :--- | :----- | :---------- | :------------------------------------ |
| `display`      | Fredoka One | 40sp | 700    | 1.2         | Mission Complete title, splash screen |
| `heading1`     | Fredoka One | 32sp | 700    | 1.2         | Screen titles ("Reward Shop")         |
| `heading2`     | Fredoka One | 24sp | 700    | 1.3         | Section titles, habit card names      |
| `heading3`     | Fredoka One | 20sp | 700    | 1.3         | Card subtitles                        |
| `body`         | Nunito      | 16sp | 400    | 1.5         | Descriptions, parent text             |
| `bodySemiBold` | Nunito      | 16sp | 600    | 1.5         | Emphasized body text                  |
| `label`        | Nunito      | 14sp | 600    | 1.4         | Buttons, chips, counters              |
| `caption`      | Nunito      | 12sp | 400    | 1.4         | Timestamps, helper text               |
| `timer`        | Fredoka One | 64sp | 700    | 1.0         | Countdown timer display               |

### 3.3 React Native Implementation

```typescript
// src/theme/typography.ts

export const AppTypography = {
  display: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 40,
    fontWeight: '700' as const,
    lineHeight: 48, // 40 * 1.2
    color: AppColors.textPrimary,
  },
  heading1: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 38.4, // 32 * 1.2
    color: AppColors.textPrimary,
  },
  heading2: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 31.2, // 24 * 1.3
    color: AppColors.textPrimary,
  },
  body: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24, // 16 * 1.5
    color: AppColors.textSecondary,
  },
  timer: {
    fontFamily: 'FredokaOne-Regular',
    fontSize: 64,
    fontWeight: '700' as const,
    lineHeight: 64, // 64 * 1.0
    color: AppColors.textPrimary,
  },
  label: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 19.6, // 14 * 1.4
    color: AppColors.textPrimary,
  },
};
```

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Based on a 4dp base unit:

| Token | Value | Usage                                       |
| :---- | :---- | :------------------------------------------ |
| `xxs` | 4dp   | Icon padding, tight gaps                    |
| `xs`  | 8dp   | Inline element spacing                      |
| `sm`  | 12dp  | Card internal padding (small)               |
| `md`  | 16dp  | Card internal padding (standard), list gaps |
| `lg`  | 24dp  | Section gaps, card external margins         |
| `xl`  | 32dp  | Screen edge padding, major section dividers |
| `xxl` | 48dp  | Hero section padding                        |

### 4.2 Screen Layout

All screens follow this structure:

```
┌─────────────────────────────────┐
│  Safe Area Top (Status bar)     │
├─────────────────────────────────┤
│  App Bar / Header (56dp)        │
├─────────────────────────────────┤
│                                 │
│                                 │
│  Content Area                   │
│  (padded xl = 32dp sides)       │
│                                 │
│                                 │
├─────────────────────────────────┤
│  Safe Area Bottom (Nav bar)     │
└─────────────────────────────────┘
```

### 4.3 Responsive Breakpoints

| Device                     | Width     | Layout Adjustment                                      |
| :------------------------- | :-------- | :----------------------------------------------------- |
| Small phone                | < 360dp   | Stack elements vertically, reduce heading sizes by 20% |
| Standard phone             | 360–414dp | Default layout                                         |
| Large phone / Small tablet | 414–600dp | Default layout, slightly wider cards                   |
| Tablet                     | 600–900dp | 2-column habit cards, larger buddy area                |
| Large tablet               | > 900dp   | Centered content with max-width 600dp                  |

---

## 5. Component Specifications

### 5.1 Buttons

#### Primary Button ("Start Mission", "Done!", "Let's Go!")

```
┌─────────────────────────────────────┐
│                                     │
│          START MISSION              │  ← Fredoka One, 20sp, white
│                                     │
└─────────────────────────────────────┘
```

| Property        | Value                                      |
| :-------------- | :----------------------------------------- |
| Height          | 64dp (extra large for toddler tap targets) |
| Min Width       | 200dp                                      |
| Corner Radius   | 20dp                                       |
| Background      | Gradient → `#4ADE80` to `#22C55E` (green)  |
| Text            | Fredoka One, 20sp, White, uppercase        |
| Shadow          | `0 4dp 16dp rgba(74, 222, 128, 0.3)`       |
| Press animation | Scale down to 0.95 + slight darken (100ms) |
| Disabled        | `#3A3A5C` background, `#64748B` text       |

#### Secondary Button ("Redeem", settings actions)

| Property        | Value                                    |
| :-------------- | :--------------------------------------- |
| Height          | 48dp                                     |
| Corner Radius   | 16dp                                     |
| Background      | `#2A2A4A` with 1dp border `#4A4A6A`      |
| Text            | Nunito, 14sp, SemiBold, `#F8FAFC`        |
| Press animation | Background lightens to `#3A3A5C` (100ms) |

#### Icon Button (Mute, Settings gear, Back)

| Property      | Value                              |
| :------------ | :--------------------------------- |
| Size          | 48×48dp (minimum tap target)       |
| Icon size     | 24dp                               |
| Corner Radius | Full circle (24dp)                 |
| Background    | Transparent (with 48dp tap target) |
| Press         | Ripple or background `#FFFFFF10`   |

### 5.2 Habit Card

The main interactive element on the Home screen.

```
┌──────────────────────────────────────────┐
│  ┌──────┐                                │
│  │  🪥  │  Brush Your Teeth        ✅    │
│  │      │  ⏱ 2:00                        │
│  └──────┘                                │
└──────────────────────────────────────────┘
```

| Property        | Value                                               |
| :-------------- | :-------------------------------------------------- |
| Height          | ~96dp                                               |
| Corner Radius   | 20dp                                                |
| Background      | `#2A2A4A`                                           |
| Left accent     | 4dp wide vertical bar in habit color                |
| Icon area       | 56×56dp rounded square, habit color at 10% opacity  |
| Title           | Fredoka One, 20sp, `#F8FAFC`                        |
| Timer subtitle  | Nunito, 14sp, `#CBD5E1`                             |
| Status icon     | ✅ (24dp) or no icon (pending)                      |
| Tap animation   | Entire card scales to 0.97, shadow elevates (150ms) |
| Completed state | Title text strikethrough, opacity 0.6               |

### 5.3 Bolt Counter

Displayed in the app bar. Shows the child's current Gold Bolt balance.

```
  ┌──────────────┐
  │  🔩  12      │
  └──────────────┘
```

| Property            | Value                                                      |
| :------------------ | :--------------------------------------------------------- |
| Container           | Pill shape, `#FBBF2420` background, `#FBBF24` border (1dp) |
| Icon                | 🔩 or custom bolt icon, 20dp, `#FBBF24`                    |
| Text                | Fredoka One, 18sp, `#FBBF24`                               |
| Increment animation | Number bounces up, "+1" floats up and fades out (400ms)    |

### 5.4 Timer Ring

The circular countdown timer on the Mission screen.

```
        ╭───────────╮
      ╱    1 : 4 2    ╲
     │                  │   ← Circular progress ring
      ╲               ╱       (habit accent color)
        ╰───────────╯
```

| Property              | Value                                                        |
| :-------------------- | :----------------------------------------------------------- |
| Diameter              | 200dp                                                        |
| Ring thickness        | 8dp                                                          |
| Ring color (progress) | Habit accent color                                           |
| Ring color (track)    | `#3A3A5C`                                                    |
| Time text             | Fredoka One, 64sp, `#F8FAFC`, centered                       |
| Warning state         | Ring color shifts to `#EF4444` (red) at 10 seconds remaining |
| Ring animation        | Smooth `AnimationController` countdown, not frame-stepped    |

### 5.5 Coupon Card (Reward Shop)

```
┌──────────────────────────────────────────┐
│                                          │
│  Extra Story Time                        │
│  🔩 3 bolts                              │
│                                          │
│               ┌──────────┐               │
│               │  REDEEM  │               │
│               └──────────┘               │
└──────────────────────────────────────────┘
```

| Property         | Value                                                        |
| :--------------- | :----------------------------------------------------------- |
| Corner Radius    | 20dp                                                         |
| Background       | `#2A2A4A`                                                    |
| Decoration       | Subtle ticket/coupon cutout on left edge (half-circle notch) |
| Title            | Fredoka One, 20sp, `#F8FAFC`                                 |
| Cost             | Nunito, 14sp, `#FBBF24`, with bolt icon                      |
| Redeem button    | Green gradient when affordable, disabled `#3A3A5C` when not  |
| Redeemed overlay | Diagonal "REDEEMED" stamp, 50% opacity, `#22C55E`            |

### 5.6 Streak Calendar (Parent Dashboard)

```
  M    T    W    T    F    S    S
  🟢   🟢   🟢   ⚫   🟢   ⚫   ⚫
```

| Property       | Value                                         |
| :------------- | :-------------------------------------------- |
| Layout         | Horizontal row of 7 circles, evenly spaced    |
| Circle size    | 36dp                                          |
| Completed day  | Filled `#4ADE80`, with subtle glow            |
| Incomplete day | `#3A3A5C` with `1dp` border `#4A4A6A`         |
| Current day    | Pulsing border animation (1s loop, `#FBBF24`) |
| Day label      | Nunito, 12sp, `#64748B`, above circle         |

### 5.7 Progress Bar (Construction Caution Tape)

The daily progress indicator on the Home screen.

```
  Today's Missions
  ████████░░░░░░░░  1 of 3  ✨
```

| Property      | Value                                                       |
| :------------ | :---------------------------------------------------------- |
| Height        | 12dp                                                        |
| Corner radius | 6dp (pill)                                                  |
| Track         | `#3A3A5C`                                                   |
| Fill          | Gradient `#FBBF24` → `#FB923C` (gold to orange)             |
| Pattern       | Diagonal stripes (45°, 4dp wide) — construction tape effect |
| Label         | Nunito, 14sp, `#CBD5E1`, right-aligned                      |
| Animation     | Fill width animates with spring curve when progress changes |

### 5.8 Offline Banner

```
┌────────────────────────────────────────────┐
│  📡  Offline — data will sync when         │
│      connected                             │
└────────────────────────────────────────────┘
```

| Property         | Value                                  |
| :--------------- | :------------------------------------- |
| Position         | Below app bar, full width              |
| Height           | 36dp                                   |
| Background       | `#EAB30820` (warning at 12% opacity)   |
| Text             | Nunito, 12sp, `#EAB308`                |
| Icon             | 📡 or wifi-off, 16dp                   |
| Appear/disappear | Slide down / slide up (200ms, easeOut) |

---

## 6. Animation Guidelines

### 6.1 Micro-Animations (React Native Reanimated)

| Animation              | Duration   | Curve                  | Trigger                 |
| :--------------------- | :--------- | :--------------------- | :---------------------- |
| Button press scale     | 100ms      | `easeInOut`            | `onTapDown` / `onTapUp` |
| Card tap scale         | 150ms      | `easeOut`              | `onTap`                 |
| Bolt counter increment | 400ms      | `bounceOut`            | On mission success      |
| "+1 🔩" float up       | 800ms      | `easeOut`              | On mission success      |
| Progress bar fill      | 500ms      | `spring(damping: 0.7)` | On habit completion     |
| Screen transition      | 300ms      | `easeInOutCubic`       | Navigation push/pop     |
| Timer ring countdown   | Continuous | `linear`               | During active mission   |
| Offline banner slide   | 200ms      | `easeOut`              | Connectivity change     |

### 6.2 Buddy Animations (Reanimated)

| State       | Animation Style                                                | Notes                                                              |
| :---------- | :------------------------------------------------------------- | :----------------------------------------------------------------- |
| **Idle**    | Gentle floating up/down (`translateY`)                         | Calm, inviting. ~2s looping bounce.                                |
| **Active**  | Fast `withSpring` scaling, bouncing props                      | Energetic, fun. Syncs generically with upbeat tempo.               |
| **Success** | Massive jump (`translateY`) + 360 spin (`rotateZ`) + particles | The biggest, most rewarding animation. Celebratory. 3–5s one-shot. |
| **Sleepy**  | Slow swaying back and forth (`rotateZ`), scaled down           | Gentle, not punishing. 3s one-shot then hold.                      |

### 6.3 State Transitions

```
IDLE ──(fade 300ms)──▶ ACTIVE
ACTIVE ──(quick cut + flash 200ms)──▶ SUCCESS
ACTIVE ──(slow fade 500ms)──▶ SLEEPY
SUCCESS ──(fade 400ms)──▶ (navigate to Result screen)
SLEEPY ──(fade 400ms)──▶ (navigate to Result screen)
```

### 6.4 Reduce Motion

When checking `AccessibilityInfo.isReduceMotionEnabled()` (React Native):

- Buddy programmatic animations rest on first frame (no bouncing/swaying)
- Micro-animations are disabled (instant state changes)
- Timer ring still updates (functional, not decorative)
- Screen transitions use instant cut (no slide/fade)

---

## 7. Iconography

### 7.1 Icon Style

- **Source:** Kenney.nl UI Pack (CC0) + custom where needed
- **Style:** Rounded, filled, 2dp stroke weight when outlined
- **Size:** 24dp default, 20dp in compact contexts, 32dp for emphasis
- **Color:** Inherit from context (accent or text color)

### 7.2 Icon Reference

| Icon            | Usage              | Source                   |
| :-------------- | :----------------- | :----------------------- |
| ⚙️ Gear         | Settings access    | Kenney or Material Icons |
| 🏆 Trophy       | Reward Shop access | Kenney                   |
| 📊 Chart        | Dashboard access   | Kenney or Material Icons |
| 🔇 / 🔊 Speaker | Mute toggle        | Material Icons           |
| ◀️ Back arrow   | Navigation back    | Material Icons           |
| ✅ Checkmark    | Habit completed    | Custom (rounded, green)  |
| 🔩 Bolt         | Currency           | Custom or Kenney         |
| ⏱ Timer         | Habit duration     | Material Icons           |
| ➕ Plus         | Add coupon         | Material Icons           |
| 🗑️ Trash        | Delete coupon      | Material Icons           |

---

## 8. Sound Design Guide

### 8.1 Audio Layers

```
Layer 3 (top):    🗣️ Voice-over cues ──────────── triggered at events
Layer 2 (mid):    🔊 Sound effects ────────────── triggered by actions
Layer 1 (base):   🎵 Background music loop ────── always playing during mission
```

### 8.2 Volume Levels

| Layer            | Default Volume | Ducking (when VO plays) |
| :--------------- | :------------- | :---------------------- |
| Background music | 40%            | Ducks to 20% during VO  |
| Sound effects    | 70%            | No ducking              |
| Voice-over       | 100%           | Full volume (priority)  |

### 8.3 Audio Behavior

| Event                  | Audio Response                                              |
| :--------------------- | :---------------------------------------------------------- |
| Enter Mission screen   | Music fades in (500ms)                                      |
| Tap "Start Mission"    | SFX: chime. VO: "Hey! Are you ready?"                       |
| Timer at 50%           | VO: "Almost there! Keep going!"                             |
| Timer at 10s remaining | SFX: gentle tick each second                                |
| Tap "Done!"            | SFX: bolt jingle. Music swells. VO: "Mission Accomplished!" |
| Timer expires (Sleepy) | Music fades to minor key. VO: "I'm getting so sleepy…"      |
| Leave Mission screen   | Music fades out (300ms)                                     |
| Mute toggle            | All layers stop/resume instantly                            |

---

## 9. Wireframes

### 9.1 Core Screens (Home, Mission, Success, Reward Shop)

![Core screen wireframes](../wireframes/main-screens.png)

**Screen breakdown:**

1. **Home Screen** — 3 habit cards with completion status, bolt counter in header, progress bar at bottom
2. **Mission Screen** — Buddy animation area (60%), circular timer, "Start Mission" / "Done!" button
3. **Success Screen** — Celebratory buddy animation, "+1 🔩" bolt earned, confetti/stars
4. **Reward Shop** — Bolt balance, list of coupon cards with "Redeem" buttons

### 9.2 Secondary Screens (Splash, Onboarding, Sign-In, Dashboard)

![Secondary screen wireframes](../wireframes/secondary-screens.png)

**Screen breakdown:**

1. **Splash Screen** — App logo with animated Dino, "HabitBuddy" title
2. **Onboarding** — Child name input with friendly Dino illustration
3. **Sign-In** — Google + Apple OAuth buttons, "Continue without account" option
4. **Parent Dashboard** — Today's summary, 7-day streak calendar, bolt statistics

---

## 10. Screen-by-Screen Specification

### 10.1 Home Screen

```
┌─────────────────────────────────┐
│  ⚙️          Hi, Leo!       🔩 5 │  ← App Bar (56dp)
├─────────────────────────────────┤
│                                 │
│  Today's Missions               │  ← heading2
│                                 │
│  ┌─────────────────────────────┐│
│  │ 🪥  Brush Your Teeth  ⏱2:00││  ← HabitCard (green)
│  └─────────────────────────────┘│
│                                 │  ← 12dp gap
│  ┌─────────────────────────────┐│
│  │ 🍽️  Eat Your Meal    ⏱15:00││  ← HabitCard (orange)
│  └─────────────────────────────┘│
│                                 │  ← 12dp gap
│  ┌─────────────────────────────┐│
│  │ 🧸  Pick Up Toys     ⏱5:00 ││  ← HabitCard (blue)
│  └─────────────────────────────┘│
│                                 │
│  ████████░░░░░░░  1/3 done  ✨  │  ← Progress bar
│                                 │
│  ┌──────────┐  ┌──────────┐     │
│  │ 🏆 Shop  │  │ 📊 Stats │     │  ← Bottom shortcuts
│  └──────────┘  └──────────┘     │
│                                 │
└─────────────────────────────────┘
```

### 10.2 Mission Screen (Idle → Active)

```
┌─────────────────────────────────┐
│  ◀️        Brush Teeth      🔇  │  ← App Bar
├─────────────────────────────────┤
│                                 │
│                                 │
│         ┌───────────┐           │
│         │           │           │
│         │  🦖 DINO  │           │  ← Rive animation (60%)
│         │  (Idle /  │           │
│         │  Active)  │           │
│         │           │           │
│         └───────────┘           │
│                                 │
│          ╭─────────╮            │
│         ╱   1:42    ╲           │  ← Timer ring (200dp)
│        │             │          │
│         ╲           ╱           │
│          ╰─────────╯            │
│                                 │
│  ┌─────────────────────────────┐│
│  │      START MISSION          ││  ← Primary button (64dp)
│  └─────────────────────────────┘│
│         ── or after start ──    │
│  ┌─────────────────────────────┐│
│  │         DONE! ✨            ││  ← Gold button (64dp)
│  └─────────────────────────────┘│
│                                 │
└─────────────────────────────────┘
```

### 10.3 Mission Result — Success

```
┌─────────────────────────────────┐
│          ✨ 🎉 ✨               │  ← Confetti/sparkle particles
│                                 │
│                                 │
│         ┌───────────┐           │
│         │           │           │
│         │  🦖 DINO  │           │  ← Victory Stomp animation
│         │ (Success) │           │
│         │           │           │
│         └───────────┘           │
│                                 │
│     MISSION COMPLETE!           │  ← display (40sp), gold
│                                 │
│          + 1  🔩                │  ← Bolt earned (floats up)
│                                 │
│     Returning home in 4s...     │  ← caption, auto-redirect
│                                 │
└─────────────────────────────────┘
```

### 10.4 Mission Result — Sleepy

```
┌─────────────────────────────────┐
│                                 │
│          🌙  💤                 │  ← Moon + zzz
│                                 │
│         ┌───────────┐           │
│         │           │           │
│         │  🦖 DINO  │           │  ← Yawning animation
│         │ (Sleepy)  │           │
│         │           │           │
│         └───────────┘           │
│                                 │
│     Time's up!                  │  ← heading1, soft blue
│     Let's try again tomorrow.   │  ← body, encouraging
│                                 │
│     Returning home in 4s...     │  ← caption, auto-redirect
│                                 │
└─────────────────────────────────┘
```

---

## 11. React Native Theme Implementation

```typescript
// src/theme/colors.ts

export const AppColors = {
  // Backgrounds
  deepIndigo: '#1A1A2E',
  nightPurple: '#16213E',

  // Surfaces
  cardDark: '#2A2A4A',
  cardMedium: '#3A3A5C',
  elevated: '#4A4A6A',

  // Accents
  dinoGreen: '#4ADE80',
  missionOrange: '#FB923C',
  rewardGold: '#FBBF24',
  sleepyBlue: '#60A5FA',

  // Status
  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
};

export const getHabitColor = (habitId: string) => {
  switch (habitId) {
    case 'brush_teeth':
      return AppColors.dinoGreen;
    case 'eat_meal':
      return AppColors.missionOrange;
    case 'pick_up_toys':
      return AppColors.sleepyBlue;
    default:
      return AppColors.dinoGreen;
  }
};
```

---

## 12. Spacing Constants

```typescript
// src/theme/spacing.ts

export const AppSpacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const AppRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999, // Pill shape
};

export const AppSizes = {
  buttonHeightPrimary: 64,
  buttonHeightSecondary: 48,
  iconButton: 48, // Minimum tap target
  habitCardHeight: 96,
  timerDiameter: 200,
  appBarHeight: 56,
  boltCounterHeight: 36,
  streakCircle: 36,
  progressBarHeight: 12,
};
```
