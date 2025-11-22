# Migration & Setup Guide

## 1. Firebase Storage Setup (Current Phase)
1. Ensure `.env.local` has all `VITE_FIREBASE_*` keys.
2. Ensure `firebase.storage.rules` are deployed in Firebase Console.
3. Create Admin User:
   - Run `node scripts/setupAdmin.cjs` (ensure `service-account.json` exists).
   - Or manually create user in Auth & Firestore `admins` collection.

## 2. Testing Uploads
1. Login at `/admin/login`.
2. Go to Dashboard > Add Product.
3. Drag & drop multiple images.
4. Verify progress bars appear.
5. Verify images appear in preview.
6. Save product.
7. Check Firestore: `products/{id}` should have `images: ["https://firebasestorage...", ...]`.

## 3. Future Migration to Backblaze B2
When ready to switch to B2:
1. Create B2 Bucket `komali-sarees` (Public).
2. Get App Keys (ID & Secret).
3. Update `scripts/migrate-firebase-to-b2.js` with your B2 keys.
4. Run Dry Run: `node scripts/migrate-firebase-to-b2.js`
5. Run Live: `node scripts/migrate-firebase-to-b2.js --run`
6. Update `.env.local` to use B2 logic (switch upload function in `ProductForm.tsx` to use `sign-b2-upload`).
