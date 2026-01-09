# Cloudflare Pages Deployment Guide

This guide covers how to deploy the **Komali Sarees** application to the Cloudflare stack (Pages, D1, R2).

## 1. Initial Local Setup (One-time)
Ensure you have authenticated with Wrangler:
```powershell
npx wrangler login
```

## 2. Infrastructure Setup
If you haven't created your D1 and R2 instances yet, run these commands:

### A. Create D1 Database
```powershell
npx wrangler d1 create komali_db
```
*Note: Copy the `database_id` and update it in your `wrangler.toml`.*

### B. Initialize Database Schema
```powershell
npx wrangler d1 execute komali_db --remote --file=./schema.sql
```

### C. Create R2 Bucket
```powershell
npx wrangler r2 bucket create komali-assets
```

## 3. Cloudflare Dashboard Configuration
Connect your GitHub repository to Cloudflare Pages and use these settings:

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | None (or Vite) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Install command** | `npm install` |
| **Environment Variables** | (Copy from your `.env.local`) |

### Critical Environment Variables
Add these in **Settings > Functions > Compatibility Flags** or as **Variables**:
*   `VITE_FIREBASE_API_KEY`
*   `VITE_GEMINI_API_KEY`
*   `VITE_GEMINI_MODEL` (e.g., `gemini-1.5-flash`)

### Bindings (Crucial Step)
Go to **Settings > Functions** and add these bindings:
1.  **D1 database binding**: Set variable name to `DB` and select `komali_db`.
2.  **R2 bucket binding**: Set variable name to `BUCKET` and select `komali-assets`.

## 4. Manual Deployment
To deploy directly from your local machine:
```powershell
npm run build
npm run deploy
```

---
**The app is now fully optimized for the Cloudflare network!**
