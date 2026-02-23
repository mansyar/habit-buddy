# Product Guidelines

## 1. Brand Voice & Tone

- **Reassuring & Educational**: Focus on positive reinforcement, child development, and healthy routines. All communication to the parent must evoke trust, stability, and child safety.
- **Child-facing joyfulness**: Visual and audio representations must convey joy, excitement, and a big sense of accomplishment.

## 2. Design Principles

- **Joy First**: Bold colors, large animated buddy, celebratory feedback, playful sounds. Every screen should feel like opening a toy box.
- **Big & Bold**: Minimum 48dp tap targets. Large text. No small elements a toddler could accidentally trigger.
- **Consistent Feedback**: Every action gets a visual and audio response.
- **Parental Confidence**: Parent-facing UI (settings, dashboard) uses a calmer, more mature aesthetic while remaining in the same color family.
- **Accessibility by Default**: High contrast, screen reader labels on parent screens, and respect for the device's "Reduce Motion" setting.

## 3. UI/UX Rules

- **Parent in Control**: The child should never navigate menus. The parent is always driving the initial navigation while the child participates visually and physically.
- **Dark Mode Only**: Promotes vivid colors for the buddy and limits OLED power usage.
- **Programmatic Character Animations**: Utilizing Reanimated with Kenney.nl static assets, relying on springs and loops rather than complex pre-rendered video files.

## 4. Privacy & Compliance

- **No Third-Party Analytics/Ad Trackers**: Must strictly adhere to COPPA guidelines and maintain full user privacy.
- **Offline First**: All assets bundled locally, missions can be completed completely offline and synced silently later.
