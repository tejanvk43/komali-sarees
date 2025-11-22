# Final Deployment Checklist (Backblaze B2 Edition)

## 1. Backblaze B2 Setup
- [ ] Create Bucket `komali-sarees`.
- [ ] Set Bucket Settings > Lifecycle Settings > Keep only last version.
- [ ] Enable **Public Access** (or configure Cloudflare CDN in front).
- [ ] Create Application Key (Read/Write) > Copy `keyID` and `applicationKey`.
- [ ] Note down `S3 Endpoint` (e.g., `s3.us-west-005.backblazeb2.com`).

## 2. Netlify Environment Variables
Add these in **Site Settings > Environment Variables**:
- `B2_BUCKET_NAME`: `komali-sarees`
- `B2_BUCKET_REGION`: `us-west-005` (from endpoint)
- `B2_ENDPOINT_URL`: `https://s3.us-west-005.backblazeb2.com`
- `B2_KEY_ID`: `Your-Key-ID`
- `B2_KEY_SECRET`: `Your-Application-Key`
- `VITE_B2_PUBLIC_BASE_URL`: `https://f005.backblazeb2.com/file/komali-sarees` (Friendly URL)
- `VITE_FIREBASE_*`: All your Firebase keys.

## 3. Deployment
- [ ] Commit changes (excluding .env.local).
- [ ] Push to GitHub.
- [ ] Netlify will auto-deploy.

## 4. Verification
- [ ] Login to Admin Panel.
- [ ] Add a new product with multiple images.
- [ ] Verify images appear in Backblaze B2 bucket.
- [ ] Verify images load on the frontend product modal.
