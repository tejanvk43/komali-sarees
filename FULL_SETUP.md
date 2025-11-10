# 🎁 Saree Customs - Complete Setup & Deployment Guide

Full-stack saree store with React frontend, Express backend, PostgreSQL database, and AWS S3 storage.

---

## 📋 Project Structure

```
saree-customs/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── pages/         # Shop, AdminPanel, NotFound
│       ├── components/    # UI components + modals
│       └── lib/           # Utils, hooks, React Query
├── server/                # Express backend
│   ├── index.ts          # Server setup
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Database operations
│   ├── db.ts             # Drizzle setup
│   ├── s3.ts             # AWS S3 operations
│   └── seed.ts           # Sample data seeder
├── shared/                # Shared types & schemas
│   └── schema.ts         # Drizzle ORM + Zod
├── vite.config.ts        # Frontend build config
├── render.yaml           # Render deployment config
└── AWS_SETUP.md          # AWS configuration guide
```

---

## ⚡ Quick Start (Local Development)

### 1. Clone & Install

```powershell
git clone https://github.com/tejanvk43/komali-sarees.git
cd komali-sarees
npm install
```

### 2. Set Up AWS

Follow **AWS_SETUP.md** completely to:
- ✅ Create RDS PostgreSQL database
- ✅ Create S3 bucket for images
- ✅ Generate IAM credentials

### 3. Create `.env` File

Copy from `.env.example` and fill in your AWS details:

```powershell
# Copy template
cp .env.example .env

# Edit .env with your values:
# - DATABASE_URL from RDS
# - AWS credentials from IAM
# - S3 bucket URL
```

Example `.env`:
```
DATABASE_URL=postgresql://postgres:mypassword@saree-customs-db.xxxx.us-east-1.rds.amazonaws.com:5432/sarees
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA2XXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=wJalxxxxxxxx...
AWS_S3_BUCKET=saree-customs-images-20251110
AWS_S3_BUCKET_URL=https://saree-customs-images-20251110.s3.us-east-1.amazonaws.com
NODE_ENV=development
PORT=5000
```

### 4. Initialize Database

```powershell
# Push schema to RDS
npx drizzle-kit push

# Seed with sample data
npx tsx server/seed.ts
```

### 5. Start Development

```powershell
npm run dev
```

Open http://localhost:5000 in browser

---

## 🏪 Using the Application

### Customer Features (Shop Page)
- Browse sarees with filtering (color, fabric, occasion, style, price)
- View product details in modal
- Add/remove from cart (localStorage)
- Responsive design (mobile, tablet, desktop)

### Admin Features (Admin Panel - /admin)
- **Products Tab**:
  - View all products
  - Add new product (with image upload to S3)
  - Edit existing product
  - Delete product
  
- **Tags Tab**:
  - View tags by category
  - Add new tag (color, fabric, occasion, style)
  - Edit tag details
  - Delete tag

#### Admin Usage
1. Go to http://localhost:5000/admin
2. Click "Add Product"
3. Fill form with product details
4. **Image URLs**: Can paste multiple S3 URLs or will auto-upload
5. Select tags and save
6. Images stored in AWS S3, URLs saved to RDS

---

## 🔨 Available Scripts

```powershell
npm run dev          # Start development server (backend + frontend HMR)
npm run build        # Build for production (frontend + backend bundle)
npm run build:demo   # Frontend demo build only (no backend)
npm start            # Start production server
npm run check        # TypeScript type check
npm run db:push      # Push schema changes to database
```

---

## 🚀 Deploy to Render (Production)

### Prerequisites
- AWS RDS database created ✅
- AWS S3 bucket created ✅
- IAM credentials generated ✅
- Code pushed to GitHub ✅

### Deployment Steps

1. **Go to** https://render.com
2. **Create New** → **Web Service**
3. **Connect GitHub repo** (authorize if needed)
4. **Configure**:
   - **Name**: `saree-customs`
   - **Environment**: Node
   - **Build Command**: `npm ci --include=dev && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter for production)

5. **Add Environment Variables** (Settings → Environment):
   ```
   NODE_ENV = production
   DATABASE_URL = postgresql://postgres:PASSWORD@ENDPOINT:5432/sarees
   AWS_REGION = us-east-1
   AWS_ACCESS_KEY_ID = AKIA...
   AWS_SECRET_ACCESS_KEY = wJal...
   AWS_S3_BUCKET = saree-customs-images-...
   AWS_S3_BUCKET_URL = https://saree-customs-images-....s3.us-east-1.amazonaws.com
   ```

6. **Deploy**:
   - Click "Create Web Service"
   - Wait 5-10 minutes for build
   - Your site is live at `https://saree-customs.onrender.com` (or custom domain)

### Auto-Deploys
- Every push to `main` branch auto-deploys
- Check Render dashboard for build logs
- Rollback to previous deployment if needed

---

## 📊 Database Schema

### Products Table
```sql
id | name | description | price | images (array) | fabric | occasion | inStock | featured | createdAt
```

### Tags Table
```sql
id | name | category (color/fabric/occasion/style) | colorHex | createdAt
```

### Product-Tags Junction
```sql
id | productId | tagId
```

### Cart Items Table
```sql
id | sessionId | productId | quantity | createdAt
```

### Admin Users Table
```sql
id | username | password | createdAt
```

---

## 🔌 API Endpoints

### Products
- `GET /api/products` - All products
- `GET /api/products/with-tags` - Products with tags
- `GET /api/products/:id` - Single product
- `POST /api/products` - Create (admin)
- `PATCH /api/products/:id` - Update (admin)
- `DELETE /api/products/:id` - Delete (admin)

### Tags
- `GET /api/tags` - All tags
- `POST /api/tags` - Create (admin)
- `PATCH /api/tags/:id` - Update (admin)
- `DELETE /api/tags/:id` - Delete (admin)

### Cart
- `GET /api/cart/:sessionId` - Cart items
- `POST /api/cart` - Add to cart
- `PATCH /api/cart/:id` - Update quantity
- `DELETE /api/cart/:id` - Remove item

---

## 🖼️ Image Upload & Storage

### How It Works
1. Admin uploads image via form
2. Image sent to S3 via AWS SDK
3. S3 URL returned and saved to RDS
4. Product displays image from S3 CDN

### Image Management
- **Folder structure**: `s3://bucket/products/TIMESTAMP-FILENAME.jpg`
- **Public access**: Enabled for all product images
- **Optimization**: Use optimized images (< 5MB recommended)

### S3 Bucket URL Format
```
https://BUCKET_NAME.s3.REGION.amazonaws.com/products/1731239400000-saree1.jpg
```

---

## 🔐 Security

### Best Practices
✅ Environment variables for secrets (never commit)  
✅ Database user with minimal permissions  
✅ S3 bucket public read-only (no write from browser)  
✅ HTTPS enforced on Render  
✅ CORS configured for S3  

### What NOT To Do
❌ Commit `.env` file  
❌ Share AWS credentials  
❌ Make S3 bucket world-writable  
❌ Use root AWS account credentials  
❌ Store passwords in plain text  

---

## 🐛 Troubleshooting

### RDS Connection Issues
```
Error: connect ECONNREFUSED
```
**Solutions**:
- Check security group allows 5432 from your IP
- Verify DATABASE_URL format
- Ensure RDS instance is running
- Check username/password

### S3 Upload Fails
```
Error: AccessDenied
```
**Solutions**:
- Verify IAM user has S3FullAccess
- Check bucket policy allows PutObject
- Verify bucket name in AWS_S3_BUCKET
- Check CORS configuration

### Build Fails on Render
```
Error: npm ERR! missing script: "build"
```
**Solutions**:
- Ensure render.yaml has `npm ci --include=dev`
- Check package.json has "build" script
- Verify esbuild is in devDependencies

### Cannot Access Admin Panel
1. Ensure you're at `http://localhost:5000/admin`
2. Check database is seeded with products
3. Verify server is running without errors

---

## 📈 Scaling & Next Steps

### For More Traffic
- Upgrade Render plan (Starter: $7/month)
- Enable Render's auto-scaling
- Consider CDN for images (CloudFront)

### For More Features
- Add payment processing (Stripe)
- Implement user authentication
- Add order management
- Email notifications
- Product reviews/ratings

### Cost Optimization
- Use S3 Intelligent Tiering
- Set image expiration policies
- Archive old database backups
- Monitor AWS usage with Cost Explorer

---

## 📞 Support

### Common Questions

**Q: How do I add more products?**
A: Use Admin Panel → Products → Add Product

**Q: Where are images stored?**
A: AWS S3 bucket configured in environment variables

**Q: How do I backup the database?**
A: RDS automated backups enabled by default (7 days). AWS also provides manual snapshots.

**Q: Can I use a different database?**
A: Yes, Drizzle ORM supports MySQL, SQLite, etc. Update DB client in `server/db.ts`

**Q: How do I add authentication?**
A: Implement passport.js middleware in `server/index.ts`. Schema has `admin_users` table.

---

## 🎉 You're All Set!

Your full-stack saree store is ready to:
- ✅ Browse & filter products
- ✅ Manage inventory via admin panel
- ✅ Store images on AWS S3
- ✅ Handle persistent data in RDS
- ✅ Scale globally on Render

**Next**: Follow AWS_SETUP.md to configure cloud infrastructure, then `npm run dev` to start!
