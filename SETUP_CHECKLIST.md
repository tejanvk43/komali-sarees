# 🚀 Project Setup Checklist

Complete this checklist to have a fully functional production-ready saree store.

---

## Phase 1: Local Setup (15 minutes)

- [ ] Clone repository: `git clone https://github.com/tejanvk43/komali-sarees.git`
- [ ] Install dependencies: `npm install`
- [ ] Read AWS_SETUP.md for AWS configuration instructions
- [ ] Copy `.env.example` to `.env`

---

## Phase 2: AWS Setup (30 minutes)

### RDS PostgreSQL
- [ ] Create AWS account at https://aws.amazon.com
- [ ] Navigate to RDS service
- [ ] Create PostgreSQL database:
  - [ ] Instance identifier: `saree-customs-db`
  - [ ] Username: `postgres`
  - [ ] Create strong password (save it!)
  - [ ] Make publicly accessible
  - [ ] Initial database name: `sarees`
- [ ] Copy endpoint (e.g., `saree-customs-db.xxxx.us-east-1.rds.amazonaws.com`)
- [ ] Create DATABASE_URL: `postgresql://postgres:PASSWORD@ENDPOINT:5432/sarees`
- [ ] Test connection from local machine

### S3 Bucket
- [ ] Navigate to S3 service
- [ ] Create bucket: `saree-customs-images-YYYYMMDD`
- [ ] Disable "Block Public Access"
- [ ] Add bucket policy for public read access
- [ ] Enable CORS for uploads
- [ ] Copy bucket name and URL

### IAM User
- [ ] Navigate to IAM service
- [ ] Create user: `saree-customs-app`
- [ ] Attach policies: `AmazonS3FullAccess`, `AmazonRDSDataFullAccess`
- [ ] Generate access keys
- [ ] Copy Access Key ID and Secret Access Key
- [ ] **Store securely** (only shown once!)

---

## Phase 3: Environment Configuration (5 minutes)

Update `.env` file with:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@ENDPOINT:5432/sarees
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJal...
AWS_S3_BUCKET=saree-customs-images-YYYYMMDD
AWS_S3_BUCKET_URL=https://saree-customs-images-YYYYMMDD.s3.us-east-1.amazonaws.com
```

- [ ] Fill in all AWS values from Phase 2
- [ ] Save `.env`
- [ ] Add `.env` to `.gitignore` (never commit secrets!)

---

## Phase 4: Database Setup (5 minutes)

```powershell
# Push schema to RDS
npx drizzle-kit push

# Seed with sample products
npx tsx server/seed.ts
```

- [ ] Run drizzle-kit push
- [ ] Run seed.ts
- [ ] See success messages
- [ ] Verify tables in RDS AWS console

---

## Phase 5: Local Testing (10 minutes)

```powershell
npm run dev
```

- [ ] Server starts on http://localhost:5000
- [ ] Shop page loads with 6 sample products
- [ ] Admin panel accessible at http://localhost:5000/admin
- [ ] Can add products and upload images
- [ ] Cart functionality works
- [ ] Filtering works (color, fabric, occasion, style)

---

## Phase 6: Deploy to Render (10 minutes)

### Create Render Service
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - [ ] Name: `saree-customs`
   - [ ] Runtime: `Node`
   - [ ] Build Command: `npm ci --include=dev && npm run build`
   - [ ] Start Command: `npm start`
   - [ ] Plan: Free (or Starter)

### Add Environment Variables
- [ ] NODE_ENV = `production`
- [ ] DATABASE_URL = (from Phase 2)
- [ ] AWS_REGION = `us-east-1`
- [ ] AWS_ACCESS_KEY_ID = (from Phase 2)
- [ ] AWS_SECRET_ACCESS_KEY = (from Phase 2)
- [ ] AWS_S3_BUCKET = (from Phase 2)
- [ ] AWS_S3_BUCKET_URL = (from Phase 2)

### Deploy
- [ ] Click "Create Web Service"
- [ ] Wait 5-10 minutes for build
- [ ] Check build logs for errors
- [ ] Get live URL (e.g., `https://saree-customs.onrender.com`)

---

## Phase 7: Production Testing (5 minutes)

- [ ] Visit live URL
- [ ] Shop page loads correctly
- [ ] Admin panel accessible
- [ ] Upload a product with image
- [ ] Verify image appears from S3
- [ ] Test on mobile device

---

## Phase 8: Post-Deployment (Optional)

- [ ] Set up custom domain (Render or Route53)
- [ ] Enable automatic deployments on git push
- [ ] Set up monitoring/alerts
- [ ] Configure backup frequency for RDS
- [ ] Add SSL certificate (auto with Render)
- [ ] Test email notifications (future feature)

---

## 📋 Credential Checklist (Keep Secure!)

Save these securely (use password manager):

- [ ] **RDS Endpoint**: saree-customs-db.xxxx.us-east-1.rds.amazonaws.com
- [ ] **RDS Master Password**: ________________
- [ ] **AWS Access Key ID**: AKIA________________
- [ ] **AWS Secret Access Key**: wJal________________
- [ ] **S3 Bucket Name**: saree-customs-images-YYYYMMDD
- [ ] **Render API Key**: (for CI/CD)

**NEVER commit these to Git!**

---

## ✅ You're Done!

Your production-ready saree store is now live with:

✅ React frontend (Vite)  
✅ Express backend  
✅ PostgreSQL database (AWS RDS)  
✅ Image storage (AWS S3)  
✅ Admin panel  
✅ Global deployment (Render)  

---

## 🆘 If Something Goes Wrong

### Database connection fails
→ Check RDS security group allows port 5432  
→ Verify DATABASE_URL format  
→ Ensure RDS instance is running

### S3 uploads fail
→ Check IAM user has S3FullAccess  
→ Verify bucket policy allows PutObject  
→ Check bucket CORS is configured

### Build fails
→ Check Render build logs  
→ Ensure package.json has build script  
→ Verify all dependencies installed locally

### Performance issues
→ Check Render resource usage  
→ Monitor RDS connections  
→ Optimize images before upload

---

**See FULL_SETUP.md for detailed documentation and API reference.**
