#!/usr/bin/env pwsh
# Deploy Frontend Demo - Copy & Paste Ready!
# Run each command from project root directory

Write-Host "🎁 Saree Customs Frontend Demo - Deployment Commands" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Option 1: Vercel
Write-Host "📦 OPTION 1: Deploy to Vercel (Recommended)" -ForegroundColor Yellow
Write-Host "Commands:" -ForegroundColor Gray
Write-Host "  npm install -g vercel" -ForegroundColor White
Write-Host "  vercel --prod" -ForegroundColor White
Write-Host ""

# Option 2: Netlify Drag & Drop
Write-Host "📦 OPTION 2: Deploy to Netlify (Easiest)" -ForegroundColor Yellow
Write-Host "Instructions:" -ForegroundColor Gray
Write-Host "  1. Go to https://netlify.com" -ForegroundColor White
Write-Host "  2. Drag & drop: C:\Users\pteja\OneDrive\Desktop\SareeCustoms\dist\public\" -ForegroundColor White
Write-Host "  3. Wait for deployment" -ForegroundColor White
Write-Host ""

# Option 3: Firebase
Write-Host "📦 OPTION 3: Deploy to Firebase" -ForegroundColor Yellow
Write-Host "Commands:" -ForegroundColor Gray
Write-Host "  npm install -g firebase-tools" -ForegroundColor White
Write-Host "  firebase login" -ForegroundColor White
Write-Host "  firebase init hosting" -ForegroundColor White
Write-Host "  firebase deploy" -ForegroundColor White
Write-Host ""

# Option 4: Local Testing First
Write-Host "🧪 TEST LOCALLY FIRST (Before Deploying)" -ForegroundColor Yellow
Write-Host "Commands:" -ForegroundColor Gray
Write-Host "  npm run build" -ForegroundColor White
Write-Host "  npx serve dist/public" -ForegroundColor White
Write-Host "  # Then open http://localhost:3000" -ForegroundColor Gray
Write-Host ""

# Git Push
Write-Host "📤 PUSH TO GITHUB (If using GitHub Pages)" -ForegroundColor Yellow
Write-Host "Commands:" -ForegroundColor Gray
Write-Host "  git add ." -ForegroundColor White
Write-Host "  git commit -m 'Add frontend demo'" -ForegroundColor White
Write-Host "  git push origin main" -ForegroundColor White
Write-Host ""

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "✅ Ready to Deploy!" -ForegroundColor Green
Write-Host "Choose ONE option above and run the commands" -ForegroundColor Gray
Write-Host ""
