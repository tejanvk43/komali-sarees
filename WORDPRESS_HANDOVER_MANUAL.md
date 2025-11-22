# Saree E-Commerce: WordPress + WooCommerce Agency Handover Manual

**Version:** 1.0  
**Date:** November 21, 2025  
**Project:** Saree Customs - WordPress Migration  

---

## SECTION 1 — HOSTING SETUP (Shared Hosting)

### 1.1 Purchasing Hosting
We recommend **Hostinger Premium** or **Bluehost Basic** for a balance of performance and cost for a startup store.

**Hostinger Steps:**
1.  Go to [Hostinger.in](https://www.hostinger.in).
2.  Select **"Premium Web Hosting"** (allows 100 websites, free SSL, free email).
3.  Choose the **12-month** or **48-month** plan (48 months offers best value).
4.  Create an account and pay via UPI/Card.
5.  Claim your **Free Domain** (e.g., `sareecustoms.com`) during checkout or immediately after in the dashboard.

**Bluehost Steps:**
1.  Go to [Bluehost.in](https://www.bluehost.in).
2.  Select **"Basic"** Shared Hosting.
3.  Choose the **12-month** term.
4.  Enter your desired domain name to check availability.
5.  Complete payment.

### 1.2 Connecting Domain
*If you bought the domain separately (e.g., GoDaddy):*
1.  Log in to your domain registrar (GoDaddy/Namecheap).
2.  Go to **DNS Management** > **Nameservers**.
3.  Change to **Custom Nameservers**.
4.  Enter Hostinger's nameservers:
    *   `ns1.dns-parking.com`
    *   `ns2.dns-parking.com`
5.  Save. Propagation takes 1-24 hours.

### 1.3 Activating SSL (Let’s Encrypt)
**Hostinger (hPanel):**
1.  Go to **Websites** > **Manage**.
2.  Search for **SSL** in the sidebar.
3.  Click **Install SSL** on your domain.
4.  Select **Let's Encrypt** (Free).
5.  Enable **"Force HTTPS"** once installed.

### 1.4 Creating Business Email
1.  Go to **Emails** > **Manage** (Hostinger).
2.  Select your domain.
3.  Click **Create Email Account**.
4.  **Email:** `info@sareecustoms.com` or `support@sareecustoms.com`.
5.  **Password:** Generate a strong password.
6.  Configure on mobile/desktop using IMAP settings provided (Hostinger usually auto-configures Gmail/Outlook).

### 1.5 Credentials Document
Create a secure PDF/Note containing:
*   **Hosting Login URL:** `hpanel.hostinger.com`
*   **Username:** (Your email)
*   **Password:** (Your hosting password)
*   **FTP Host:** `ftp.sareecustoms.com`
*   **FTP User/Pass:** (Create in Files > FTP Accounts)

---

## SECTION 2 — WORDPRESS INSTALLATION

### 2.1 Auto-Installer (Softaculous/hPanel)
1.  In hPanel, go to **Website** > **WordPress**.
2.  Click **Install**.
3.  **Website Title:** Komali Sarees
4.  **Administrator Email:** `info@sareecustoms.com`
5.  **Administrator Username:** `sc_admin_2025` (Avoid 'admin')
6.  **Administrator Password:** Use a 16-char alphanumeric string (e.g., `Tr$9#mK2!pL5vXz`).
7.  **Path:** Leave blank (installs in root).
8.  **Update Schedule:** "Update to minor versions only" (safer).
9.  Click **Install**.

### 2.2 Permalinks Setup
1.  Log in to WP Admin (`/wp-admin`).
2.  Go to **Settings** > **Permalinks**.
3.  Select **"Post name"** (`sample-post/`).
4.  Under "Product permalinks", select **"Custom base"** and enter `/shop/`.
5.  Save Changes.

### 2.3 General Settings
1.  **Settings** > **General**.
2.  **Site Title:** Komali Sarees
3.  **Tagline:** Premium Indian Saree Collection
4.  **Timezone:** UTC+5:30 (Kolkata).
5.  **Date Format:** `d/m/Y` (e.g., 21/11/2025).
6.  **Site Language:** English (India).

### 2.4 Security Checklist (wp-config.php)
Access via File Manager and add these lines to `wp-config.php` before `/* That's all, stop editing! */`:
```php
// Disable File Editing in Dashboard
define( 'DISALLOW_FILE_EDIT', true );

// Limit Post Revisions
define( 'WP_POST_REVISIONS', 5 );

// Force SSL Admin
define( 'FORCE_SSL_ADMIN', true );
```

---

## SECTION 3 — INSTALLING WOOCOMMERCE

### 3.1 Setup Wizard
1.  **Plugins** > **Add New** > Search "WooCommerce" > **Install & Activate**.
2.  **Store Details:**
    *   Address: (Your Business Address)
    *   Country/Region: India > Andhra Pradesh (or your state).
    *   City/Postcode: (Your details).
3.  **Industry:** Fashion, Apparel, and Accessories.
4.  **Product Types:** Physical products.
5.  **Business Details:** "I don't have an audience yet."
6.  **Free Features:** Uncheck "Add recommended business features" to avoid bloat (Jetpack, etc.).

### 3.2 Payments Setup
**Razorpay:**
1.  Install **"Razorpay for WooCommerce"** plugin.
2.  Go to **WooCommerce** > **Settings** > **Payments**.
3.  Enable **Razorpay**.
4.  Click **Manage**.
5.  **Key ID & Key Secret:** Get these from Razorpay Dashboard (Settings > API Keys).
6.  **Webhook Secret:** Generate in Razorpay (Settings > Webhooks) and paste here.
7.  **Payment Action:** "Authorize and Capture".

**Cash on Delivery (COD):**
1.  Enable **Cash on delivery** in Payments tab.
2.  Manage > Enable "Enable for shipping methods" > Select your shipping zones (see below).

### 3.3 Shipping Zones
**WooCommerce** > **Settings** > **Shipping**.
1.  **Zone 1: Local (Your City)**
    *   Region: Your Zip Codes.
    *   Method: Free Shipping.
2.  **Zone 2: Rest of India**
    *   Region: India.
    *   Method: Flat Rate (e.g., ₹100) or Free Shipping (Requires min order ₹2000).
3.  **Zone 3: International** (Optional)
    *   Region: Rest of the World.
    *   Method: Flat Rate (e.g., ₹2500).

### 3.4 Tax (GST)
**WooCommerce** > **Settings** > **General** > Enable "Enable tax rates and calculations".
1.  Go to **Tax** tab.
2.  **Prices entered with tax:** No, I will enter prices exclusive of tax.
3.  **Calculate tax based on:** Customer shipping address.
4.  **Display prices in shop:** Including tax.
5.  **Standard Rates:**
    *   Insert Row: Country Code `IN`, Rate `5.000` (for Sarees < ₹1000) or `12.000` (check current GST slabs).
    *   Name: "GST".
    *   Priority: 1.
    *   Compound: Unchecked.
    *   Shipping: Checked.

### 3.5 Product Units
1.  **Products** > **Attributes**.
2.  Create attributes like **Fabric** (Cotton, Silk) and **Occasion**.
3.  For weight/dimensions: **WooCommerce** > **Settings** > **Products** > **General**.
    *   Weight unit: kg.
    *   Dimensions unit: cm.

---

## SECTION 4 — APPLYING CUSTOM UI TEMPLATE

### 4.1 Theme Installation
1.  **Appearance** > **Themes** > **Add New**.
2.  Install **Hello Elementor** (Best blank canvas).
3.  Activate.
4.  Delete other themes (Twenty Twenty-Four, etc.).

### 4.2 Clean Slate
1.  Go to **Pages** > Trash "Sample Page".
2.  Go to **Posts** > Trash "Hello World".

### 4.3 Global Styles (Elementor)
1.  **Elementor** > **Tools** > **General** > Check "Disable Default Colors" and "Disable Default Fonts".
2.  Open any page with **Edit with Elementor**.
3.  Hamburger Menu (Top Left) > **Site Settings**.
4.  **Global Colors:**
    *   Primary: `#4A0404` (Burgundy/Red from your UI).
    *   Secondary: `#D4AF37` (Gold).
    *   Text: `#333333`.
    *   Accent: `#E5E5E5`.
5.  **Global Fonts:**
    *   Primary: **Playfair Display** (Headings).
    *   Secondary: **Inter** or **Lato** (Body).
6.  **Buttons:**
    *   Background: Primary Color.
    *   Text: White.
    *   Border Radius: 0px (Sharp) or 4px (Soft).
    *   Padding: 12px 24px.

### 4.4 Header & Footer (Elementor Pro / Header Footer Builder)
*Use "Elementor Header & Footer Builder" plugin if not using Elementor Pro.*
1.  **Appearance** > **Elementor Header & Footer Builder**.
2.  **Add New** > Title: "Global Header".
3.  **Type of Template:** Header.
4.  **Display On:** Entire Website.
5.  **Edit with Elementor:**
    *   Create 3 Columns: [Logo] [Nav Menu] [Icons (Search, Cart, User)].
    *   **Logo:** Image widget.
    *   **Nav Menu:** Navigation Menu widget (Style: Underline animation).
    *   **Icons:** Icon List or individual Icon widgets. Link Cart icon to `/cart/`.
6.  Repeat for "Global Footer" (4 Columns: About, Quick Links, Collections, Contact).

---

## SECTION 5 — ESSENTIAL PLUGINS (AGENCY SETUP)

| Plugin Name | Configuration Note |
| :--- | :--- |
| **Elementor** | Page Builder core. |
| **Elementor Pro** (or Royal Addons) | Required for Theme Builder (Shop/Single Product templates). |
| **WooCommerce** | E-commerce core. |
| **Razorpay for WooCommerce** | Payment gateway. |
| **LiteSpeed Cache** | Enable "Guest Mode" & "Cache Mobile". Connect to QUIC.cloud if needed. |
| **Yoast SEO** | Run configuration wizard. Set OpenGraph images. |
| **Site Kit by Google** | Connect Search Console & Analytics 4. |
| **Click to Chat** (WhatsApp) | Set number `91XXXXXXXXXX`. Position: Bottom Right. Style: 2. |
| **Smush** or **Imagify** | Auto-compress images on upload. |
| **WPS Hide Login** | Change login URL from `/wp-admin` to `/manage-store` for security. |

---

## SECTION 6 — HOMEPAGE SETUP (USING YOUR UI)

**Page Structure in Elementor:**

1.  **Hero Section:**
    *   **Widget:** Slides (Elementor Pro) or Image Carousel.
    *   **Settings:** Height `80vh`. Content Animation: Up.
    *   **Images:** Use the high-res saree banners.
    *   **Overlay:** Background Overlay > Black, Opacity 0.3.

2.  **Category Cards (Grid):**
    *   **Structure:** Inner Section, 6 Columns (Mobile: 2 Columns).
    *   **Widget:** Image Box or Call to Action.
    *   **Content:** Image (Round/Square), Title (Silk, Cotton), Link to Category URL.

3.  **New Arrivals:**
    *   **Widget:** "Products" (Elementor Pro) or "WooCommerce Grid" (Royal Addons).
    *   **Query:** Source > Latest Products.
    *   **Style:** Columns: 4. Rows: 1. Hide "Add to Cart" button (clean look).

4.  **Trending Sarees:**
    *   **Widget:** "Products" (Carousel layout).
    *   **Query:** Source > Featured Products.

5.  **Testimonials:**
    *   **Widget:** Testimonial Carousel.
    *   **Style:** Bubble background white, text dark.

6.  **Footer:**
    *   (Handled via Global Footer template).

---

## SECTION 7 — PRODUCT PAGE SETUP

### 7.1 Adding Products
1.  **Products** > **Add New**.
2.  **Title:** "Kanjivaram Red Silk Saree".
3.  **Description:** Long description (Story of the saree).
4.  **Product Data (Simple Product):**
    *   **General:** Regular Price (₹12000), Sale Price (₹10500).
    *   **Inventory:** SKU `SR-KAN-001`. Manage Stock > Yes > Qty 1.
    *   **Shipping:** Weight 0.8 kg.
    *   **Attributes:** Add "Color: Red", "Fabric: Silk". Check "Visible on the product page".
5.  **Product Image:** Main photography (1000x1500px).
6.  **Product Gallery:** Close-ups, Pallu shot, Blouse shot.
7.  **Short Description:** Bullet points (e.g., "• Pure Silk • Handwoven • Blouse Piece Included").

### 7.2 Custom Single Product Template (Elementor Pro)
1.  **Templates** > **Theme Builder** > **Single Product**.
2.  **Add New**.
3.  **Structure:** 2 Columns (50% Image, 50% Details).
4.  **Widgets:**
    *   Left: Product Images.
    *   Right: Product Title, Product Price, Product Short Description, Add to Cart, Product Meta (SKU/Cat).
    *   Bottom: Product Data Tabs (Description, Reviews).
5.  **Style:** Match fonts to Playfair/Inter. Button color Primary.

---

## SECTION 8 — SHOP PAGE CUSTOMIZATION

### 8.1 Archive Template
1.  **Templates** > **Theme Builder** > **Products Archive**.
2.  **Structure:**
    *   Top: Archive Title (Hidden or Styled).
    *   Body: Sidebar (Left, 25%) + Products Grid (Right, 75%).
3.  **Sidebar Widgets:**
    *   "Product Categories" List.
    *   "Filter Products by Price".
    *   "Filter Products by Attribute" (Color/Fabric).
4.  **Products Grid:**
    *   Widget: Archive Products.
    *   Columns: 3 (Desktop), 2 (Mobile).
    *   Pagination: Numbers.

### 8.2 Search Optimization
1.  Install **Relevanssi** (Free).
2.  **Settings** > **Relevanssi** > **Indexing**.
3.  Build Index.
4.  This allows searching by SKU, Category, and Description, not just titles.

---

## SECTION 9 — SPEED OPTIMIZATION

### 9.1 LiteSpeed Cache Settings
1.  **Presets** > **Advanced (Recommended)**.
2.  **Cache:** Enable Cache, Cache Logged-in Users, Cache Commenters, Cache REST API, Cache Page Login.
3.  **Page Optimization:**
    *   **CSS Settings:** Minify CSS, Combine CSS (Test carefully), CSS Combine External and Inline.
    *   **JS Settings:** Minify JS, Combine JS (Test carefully).
    *   **HTML Settings:** Minify HTML.
4.  **Image Optimization:** Auto Request Cron > On. Auto WebP Replacement > On.

### 9.2 Database
1.  **LiteSpeed Cache** > **Database**.
2.  **Clean All** (Post revisions, trashed posts, transients).
3.  Schedule weekly cleanup.

---

## SECTION 10 — CLOUDFLARE SETUP (FREE PLAN)

### 10.1 DNS & HTTPS
1.  Create Cloudflare account > Add Site.
2.  Change Nameservers at Registrar to Cloudflare's.
3.  **SSL/TLS** > **Overview** > **Full (Strict)**.
4.  **Edge Certificates** > **Always Use HTTPS** > On.

### 10.2 Page Rules
1.  **Rule 1:** `*sareecustoms.com/wp-admin*`
    *   Cache Level: Bypass.
    *   Security Level: High.
    *   Disable Performance.
2.  **Rule 2:** `*sareecustoms.com/*` (General)
    *   Cache Level: Standard.
    *   Browser Cache TTL: 4 hours.

---

## SECTION 11 — LAUNCH CHECKLIST (AGENCY GRADE)

**Functional:**
- [ ] Place a test order via Razorpay (Test Mode).
- [ ] Place a test order via COD.
- [ ] Verify "New Order" email received by Admin.
- [ ] Verify "Order Confirmation" email received by Customer.
- [ ] Check Stock reduction after order.
- [ ] Test "Contact Us" form submission.
- [ ] Verify WhatsApp button opens chat.

**UI/UX:**
- [ ] Check Homepage slider on Mobile (text readability).
- [ ] Verify Menu hamburger works on Mobile.
- [ ] Check Cart page layout on Mobile.
- [ ] Verify 404 Page exists and looks good.
- [ ] Check Favicon is visible.

**SEO & Performance:**
- [ ] Permalink structure is `/shop/product-name`.
- [ ] Sitemap (`sitemap_index.xml`) submitted to Google Search Console.
- [ ] Google Analytics 4 tracking active.
- [ ] Images are WebP (check via Inspect Element).
- [ ] GTMetrix Score > B.

**Security:**
- [ ] Login URL is hidden.
- [ ] Admin password is strong.
- [ ] Backups scheduled (UpdraftPlus or Hosting Backup).

---

## SECTION 12 — CLIENT DELIVERY MANUAL

### 12.1 How to Add a New Saree
1.  Login to `/manage-store`.
2.  Go to **Products** > **Add New**.
3.  Enter **Name** and **Description**.
4.  Set **Price** and **Sale Price**.
5.  Go to **Attributes** > Add **Color** and **Fabric**.
6.  Set **Product Image** (Main) and **Gallery** (Angles).
7.  Select **Category** (e.g., Silk).
8.  Click **Publish**.

### 12.2 How to Manage Orders
1.  Go to **WooCommerce** > **Orders**.
2.  Click on an order (Status: Processing).
3.  Pack the item.
4.  Change Status to **Completed** > Update.
5.  (Optional) Add tracking number in "Order Notes" (Right sidebar) > "Note to Customer".

### 12.3 Monthly Maintenance
1.  **Week 1:** Update Plugins (Select all > Update). *Always backup first.*
2.  **Week 2:** Check "Site Health" in Dashboard.
3.  **Week 3:** Review Google Analytics for traffic trends.
4.  **Week 4:** Delete "Trash" orders and products to clean DB.

---
**End of Document**
