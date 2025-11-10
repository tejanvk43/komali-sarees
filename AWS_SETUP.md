# AWS Setup Guide for Saree Customs

Complete AWS configuration for database (RDS) and image storage (S3).

---

## 1️⃣ AWS Account Setup

1. Go to https://aws.amazon.com
2. Click **Create an AWS Account**
3. Enter email, password, and billing info
4. Verify email and phone
5. Choose **Basic Plan** (free tier eligible)

---

## 2️⃣ Create RDS PostgreSQL Database

### Step 1: Navigate to RDS
- Go to AWS Console → Search **RDS**
- Click **Databases** → **Create database**

### Step 2: Configure Database
- **Engine**: PostgreSQL
- **Version**: 15.x (default)
- **DB instance class**: `db.t3.micro` (free tier eligible)
- **Storage**: 20 GB (free tier)
- **DB instance identifier**: `saree-customs-db`
- **Master username**: `postgres`
- **Master password**: Create a strong password (save it!)
  ```
  Example: P@ssw0rd!Secure2024
  ```

### Step 3: Network & Security
- **VPC**: Default VPC
- **Public accessibility**: **Yes** (allow remote connections)
- **Security group**: Create new or select existing
  - Rule: Inbound - PostgreSQL (5432) from 0.0.0.0/0 (allows all IPs)

### Step 4: Database options
- **Initial database name**: `sarees`
- **Automated backups**: 7 days (recommended)
- **Multi-AZ**: No (for free tier)

### Step 5: Create
- Click **Create database**
- Wait 5-10 minutes for creation
- Once available, click on the database to see details

### Step 6: Get Connection String
- Click your database → **Connectivity & security** tab
- Copy **Endpoint** (e.g., `saree-customs-db.c9akciq32.us-east-1.rds.amazonaws.com`)
- Copy **Port** (default: 5432)

Your `DATABASE_URL` will be:
```
postgresql://postgres:P@ssw0rd!Secure2024@saree-customs-db.c9akciq32.us-east-1.rds.amazonaws.com:5432/sarees
```

---

## 3️⃣ Create S3 Bucket for Images

### Step 1: Navigate to S3
- Go to AWS Console → Search **S3**
- Click **Buckets** → **Create bucket**

### Step 2: Configure Bucket
- **Bucket name**: `saree-customs-images` (must be globally unique, add date/random: `saree-customs-images-2025-11-10`)
- **Region**: Choose closest to you (e.g., `us-east-1`)
- **Block Public Access settings**: UNCHECK all boxes (we want public read access)
- Click **Create bucket**

### Step 3: Enable Public Read Access
1. Click on your bucket
2. Go to **Permissions** tab
3. **Bucket policy**: Click **Edit**
4. Paste this policy (replace `BUCKET_NAME`):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}
```
5. Click **Save changes**

### Step 4: Enable CORS (for uploads from browser)
1. Go to **Permissions** tab
2. **CORS** → Click **Edit**
3. Paste this:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```
4. Click **Save changes**

---

## 4️⃣ Create IAM User for Application

### Step 1: Navigate to IAM
- Go to AWS Console → Search **IAM**
- Click **Users** → **Create user**

### Step 2: Create User
- **User name**: `saree-customs-app`
- Click **Next**

### Step 3: Set Permissions
- Select **Attach policies directly**
- Search for and select:
  - `AmazonS3FullAccess` (for S3 operations)
  - `AmazonRDSDataFullAccess` (for RDS access)
- Click **Next** → **Create user**

### Step 4: Generate Access Keys
1. Click on the user you just created
2. Go to **Security credentials** tab
3. **Access keys** → Click **Create access key**
4. Select **Other**
5. Click **Create access key**
6. **Copy and save**:
   - **Access Key ID**: `AKIA...`
   - **Secret Access Key**: `wJal...` (only shown once!)

Store these securely - you'll need them for the application!

---

## 5️⃣ Local Development Setup

Create `.env` file in project root:

```bash
# Database (from RDS)
DATABASE_URL=postgresql://postgres:PASSWORD@ENDPOINT:5432/sarees

# AWS
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJal...
AWS_REGION=us-east-1
AWS_S3_BUCKET=saree-customs-images-2025-11-10
AWS_S3_BUCKET_URL=https://saree-customs-images-2025-11-10.s3.us-east-1.amazonaws.com

# Server
NODE_ENV=development
PORT=5000
```

Don't commit this file! Add to `.gitignore`:
```
.env
.env.local
```

---

## 6️⃣ Test Connection Locally

```powershell
# 1. Install dependencies
npm install

# 2. Set environment variables
$env:DATABASE_URL = "postgresql://..."
$env:AWS_ACCESS_KEY_ID = "..."
$env:AWS_SECRET_ACCESS_KEY = "..."
$env:AWS_REGION = "us-east-1"
$env:AWS_S3_BUCKET = "saree-customs-images-..."

# 3. Push database schema
npx drizzle-kit push

# 4. Seed database with sample data
npx tsx server/seed.ts

# 5. Start development server
npm run dev

# 6. Open http://localhost:5000
# 7. Go to /admin to test admin panel
```

---

## 7️⃣ Deploy to Render with AWS

### Create Environment Variables in Render Dashboard

1. Go to **Render Dashboard** → Select your service
2. Click **Settings**
3. Scroll to **Environment** 
4. Add these variables:

```
DATABASE_URL = postgresql://postgres:PASSWORD@ENDPOINT:5432/sarees
AWS_ACCESS_KEY_ID = AKIA...
AWS_SECRET_ACCESS_KEY = wJal...
AWS_REGION = us-east-1
AWS_S3_BUCKET = saree-customs-images-...
AWS_S3_BUCKET_URL = https://saree-customs-images-....s3.us-east-1.amazonaws.com
NODE_ENV = production
```

5. Update **Start Command** to:
```
npm start
```

6. Update **Build Command** to:
```
npm ci --include=dev && npm run build
```

7. Click **Save** → **Manual Deploy**

---

## 8️⃣ AWS Cost Estimates (Free Tier)

| Service | Free Tier | Cost After |
|---------|-----------|-----------|
| RDS PostgreSQL | 750 hours/month (always on) | ~$0.017/hour |
| S3 Storage | 5 GB | $0.023/GB |
| S3 Data transfer | 1 GB/month outbound | $0.09/GB |
| **Total (first 12 months)** | **FREE** | ~$15-50/month |

---

## 🔒 Security Best Practices

✅ **Do:**
- Store `.env` locally only (never commit)
- Use strong RDS password
- Enable RDS automated backups
- Use IAM user (not root account)
- Rotate access keys periodically

❌ **Don't:**
- Share AWS credentials
- Use root account access keys
- Make S3 bucket world-writable
- Expose DATABASE_URL in public

---

## ❓ Troubleshooting

### Can't connect to RDS
- Check security group allows 5432 from your IP
- Verify username/password
- Ensure database is publicly accessible

### S3 uploads fail
- Check bucket policy allows PutObject
- Verify IAM user has S3FullAccess
- Check CORS configuration

### Environment variables not loading
- Verify `.env` file exists in project root
- Restart `npm run dev` after editing `.env`
- Use `process.env.DATABASE_URL` to verify in code

---

**You're all set to use AWS!** Next, we'll add image upload functionality to the backend.
