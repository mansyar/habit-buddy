# Initial Concept

Build healthy routines together: A mission-based tracker for kids 3-5.

# Product Guide

## Overview

HabitBuddy focuses on transforming daily routines from "chores" into "missions" for young children, specifically targeting the critical 3-5 age group.

## Features

- **3 Fixed Core Habits**: Tooth brushing, eating meals, and picking up toys.
- **Buddy Animation State Machine**: High-quality programmatic native animations of cute animals to delight children.
- **Polished UX**: Animated splash screen, interactive button feedback (scaling), and sliding numeric animations for rewards.
- **Reward System**: A parent-managed shop where children redeem Gold Bolts for real-world rewards across three categories: Physical, Privilege, and Activity.
- **Parental Dashboard**: A centralized, professional view for parents to monitor habit summary, 7-day streaks, and bolt statistics (earned, spent, balance). Includes administrative actions like resetting daily progress.
- **Offline Capability**: Robust offline-first support allowing missions to be completed without an active connection.
- **Real-time Multi-device Sync**: Seamless background synchronization across multiple devices using Supabase Realtime.

## Non-Functional Traits

- Platform: React Native (Expo) across iOS and Android.
- Data Storage: Supabase & Local SQLite.
- Fully accessible animations, high-contrast, robust COPPA compliance natively supporting anonymous local-only onboarding.
- **Responsive Design**: Optimized for both phones and tablets with adaptive layouts.
- **Parental Gate**: Sensitive areas (like reward management) are protected by a 3-second long-press interaction to prevent accidental child access.
