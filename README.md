# Flogg
A mobile receipt logger for the floral delivery industry. Capture delivery receipts via camera (single/burst mode), auto-extract data using GPT-4o or Gemini Vision AI, and manage all records locally with SQLite. Features bilingual UI (Korean/English), dark mode, and date-grouped history. Built with React Native + Expo SDK 52.

A mobile app built for the floral delivery industry to digitize and manage delivery receipts. Delivery drivers can photograph receipts on-site, and the app automatically extracts key data (destination, orderer, product details, ribbon text) using Vision AI.
What it does:

Capture delivery receipts via camera with single-shot or burst mode
Automatically extract structured data from receipt images using GPT-4o or Google Gemini
Store all records locally with SQLite for offline access
View today's deliveries on a dashboard with a daily summary card
Browse full history grouped by date (Today / Yesterday / older dates)
Edit or delete any record with a detail view
Switch between Korean and English interface
Toggle dark mode, camera settings, AI engine, and more from a unified settings sheet

Tech stack:

React Native with Expo SDK 52
SQLite (expo-sqlite) for local persistence
OpenAI GPT-4o / Google Gemini 1.5 Flash for multimodal OCR
React Navigation 7 (Bottom Tabs + Native Stack)
AsyncStorage for user preferences
iOS Human Interface Guidelines-inspired design with semantic colors

Built as a standalone Android APK — no Expo Go or external server required at runtime. All JS bundles are embedded in the release build.
