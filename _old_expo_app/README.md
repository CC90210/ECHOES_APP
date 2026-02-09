# ECHOES - Development Setup

## Prerequisites
- Node.js (v18+)
- npm or yarn or bun
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator (optional)

## Installation

1. **Install Dependencies**
   Since the automated setup could not complete due to missing Node environment, you must install dependencies manually:
   ```bash
   npm install
   ```

2. **Start the App**
   To run the development server:
   ```bash
   npx expo start
   ```
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web Preview

## Project Structure
- `src/screens`: Main application screens (Login, Home, Record, Vault)
- `src/components`: Reusable UI components (Button, Cards)
- `src/theme`: Design system (Colors, Typography)
- `src/services`: Mock API and services (Supabase, S3 placeholders)
- `supabase_schema.sql`: Database schema for Supabase

## Database Setup
1. Create a new Supabase project.
2. Go to the SQL Editor and run the contents of `supabase_schema.sql`.
3. Update `src/services/api.ts` or create a real Supabase client when ready.

## MVP Status
- [x] Project scaffolding
- [x] Basic UI Shell
- [x] Recording Interface (Mocked)
- [x] Database Schema
- [ ] Real S3 Integration (Pending credentials)
- [ ] Real Supabase Auth (Pending credentials)
