# Implementation Plan - Phase 0: Project Scaffolding

## Phase 1: Foundation & Tooling
- [x] Task: Initialize Folder Structure ab34cb1
    - [ ] Create `src/components`, `src/lib`, `src/store`, `src/theme`, `src/types`, `src/utils`
    - [ ] Create `assets/audio/music`, `assets/audio/sfx`, `assets/audio/vo`, `assets/props`
- [x] Task: Install Core Dependencies 4076f93
    - [ ] Install `zustand`, `@supabase/supabase-js`, `expo-sqlite`, `expo-secure-store`, `expo-av`, `react-native-svg`, `date-fns`, `uuid`, `@react-native-community/netinfo`
    - [ ] Install `@expo-google-fonts/fredoka-one`, `@expo-google-fonts/nunito`
- [x] Task: Configure TypeScript Path Aliases d2fdfd1
    - [ ] Update `tsconfig.json` with `baseUrl` and `paths` (`@/*` -> `src/*`)
- [x] Task: Set up ESLint & Prettier 3bf387f
    - [ ] Install `eslint`, `prettier`, `eslint-config-prettier`, `eslint-plugin-react`, `eslint-plugin-react-native`
    - [ ] Create `.eslintrc.js` and `.prettierrc`
- [ ] Task: Set up Husky & lint-staged
    - [ ] Initialize Husky
    - [ ] Configure `lint-staged` in `package.json` to run `eslint --fix` on staged files
- [ ] Task: Initialize Vitest and React Testing Library
    - [ ] Install `vitest`, `@testing-library/react-native`, `@testing-library/jest-native`
    - [ ] Configure `vitest.config.ts` for React Native
    - [ ] Create a "Hello World" test to verify setup
- [ ] Task: Initialize Supabase CLI & Basic .env
    - [ ] Run `npx supabase init`
    - [ ] Create `.env.example` and `.env` with placeholder Supabase URL/Key
    - [ ] Add `.env` to `.gitignore`
- [ ] Task: Verify Clean Build
    - [ ] Run `pnpm expo start` and ensure no startup errors
- [ ] Task: Update `docs/roadmap.md`
    - [ ] Mark Phase 0 as completed in the roadmap file.
- [ ] Task: Conductor - User Manual Verification 'Project Scaffolding' (Protocol in workflow.md)
