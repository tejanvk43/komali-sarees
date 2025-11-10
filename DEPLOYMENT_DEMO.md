# Frontend Demo Deployment Guide

This is a **frontend-only demo** of the Saree Customs store with mock product data. No backend or database setup required!

## What's Included

✅ Full product catalog with 6 sample sarees  
✅ Filter by color, fabric, occasion, style  
✅ Shopping cart (stored locally in browser)  
✅ Product detail modal  
✅ Responsive design  
✅ No backend dependencies

## What's NOT Included

❌ Admin panel (disabled for demo)  
❌ Real database connections  
❌ Payment processing  
❌ Order management  

---

## Local Testing

Run the frontend demo locally before deploying:

```powershell
npm install
npm run build
npx serve dist/public
```

Then open http://localhost:3000 in your browser.

---

## Deploy to Vercel (Recommended - Fastest)

### Option 1: GitHub Integration (Auto-Deploy)

1. **Push code to GitHub**:
   ```powershell
   git add .
   git commit -m "Add frontend demo"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist/public`
   - Click "Deploy"

3. **Your site is live!** Vercel will provide a URL like `https://saree-customs-demo.vercel.app`

### Option 2: CLI Deploy

```powershell
npm install -g vercel
vercel --prod
```

---

## Deploy to Netlify

1. **Build locally**:
   ```powershell
   npm run build
   ```

2. **Connect to Netlify**:
   - Go to https://netlify.com
   - Drag and drop the `dist/public` folder into the drop zone
   - OR link your GitHub repo and Netlify will auto-build

3. **Your site is live!**

---

## Deploy to Firebase Hosting

1. **Install Firebase CLI**:
   ```powershell
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase**:
   ```powershell
   firebase init hosting
   ```
   - Public directory: `dist/public`
   - Configure SPA rewrite: **Yes**

3. **Deploy**:
   ```powershell
   firebase deploy
   ```

---

## Deploy to GitHub Pages

1. **Update `vite.config.ts`** if your repo is not at root:
   ```typescript
   export default defineConfig({
     base: '/saree-customs/', // if repo is at user/saree-customs
   });
   ```

2. **Build and deploy**:
   ```powershell
   npm run build
   # Push dist/public to gh-pages branch
   git subtree push --prefix dist/public origin gh-pages
   ```

3. Your site is at `https://yourusername.github.io/saree-customs`

---

## Environment Variables (None Needed!)

No environment setup required for the demo. Mock data is embedded.

---

## Switching Back to Full-Stack

When ready to add the backend again:

```powershell
npm run build:full  # Builds both frontend + server
npm run dev         # Runs full server locally
```

Update build scripts back to original:
```json
"build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
```

---

## File Structure

```
dist/public/
├── index.html              # Entry point
├── assets/                 # CSS, JS, images
├── attached_assets/        # Product images
└── ...
```

---

## Tips for Demo

- **Show filtering**: Click filters on the left to show filter functionality
- **Add to cart**: Click any product card to see the modal and add-to-cart feature
- **Responsive**: Test on mobile - it's fully responsive
- **Fast**: No network requests - demo is super fast!

---

## Updating Mock Data

To add/modify products, edit `client/src/lib/mockData.ts`:

```typescript
export const mockProducts: ProductWithTags[] = [
  {
    id: "prod-7",
    name: "Your New Saree",
    description: "...",
    price: "5000",
    images: ["/path/to/image.png"],
    // ... other fields
  },
];
```

Then rebuild:
```powershell
npm run build
```

---

## Production Considerations

After demo approval, add full-stack features:

1. **Database**: Set up PostgreSQL (Neon, Supabase, Railway)
2. **Backend**: Deploy Express server to Render or Railway
3. **Admin Panel**: Uncomment admin routes and deploy backend
4. **Images**: Upload product images to cloud storage (Supabase, Cloudinary, S3)

See `README.md` for full-stack deployment guide.
