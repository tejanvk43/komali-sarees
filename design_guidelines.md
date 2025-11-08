# Design Guidelines: Customizable Saree E-Commerce Platform

## Design Approach
**Reference-Based:** Drawing from premium fashion e-commerce (Etsy, Shopify boutiques) with cultural sophistication appropriate for traditional Indian sarees. Focus on visual richness, elegant filtering, and seamless customization experience.

## Typography
- **Primary Font:** Playfair Display (headers, product names) - elegant serif for traditional aesthetic
- **Secondary Font:** Inter (body text, UI elements) - clean sans-serif for readability
- **Hierarchy:**
  - Hero headline: text-5xl/6xl, font-semibold
  - Section headers: text-3xl/4xl, font-medium
  - Product titles: text-xl/2xl, font-medium
  - Body text: text-base/lg
  - Filter labels/buttons: text-sm, font-medium
  - Price: text-2xl, font-bold

## Layout System
**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Tight spacing: p-2, gap-2 (filter chips, tags)
- Standard: p-4, gap-4 (cards, form fields)
- Section padding: py-12/py-20 (mobile/desktop)
- Content containers: max-w-7xl with px-4

## Core Components

### Navigation
- Sticky header with logo left, main nav center, cart/account icons right
- Categories dropdown for saree types (Silk, Cotton, Designer, etc.)
- Persistent search bar with autocomplete
- Mobile: Hamburger menu with slide-out drawer

### Hero Section
Full-width hero carousel showcasing 3-4 featured saree collections with lifestyle photography. Each slide includes: overlay gradient for text readability, collection title (text-5xl), brief tagline, "Explore Collection" CTA button with blurred background.

### Product Grid
- Desktop: 4-column grid (grid-cols-4), Tablet: 3-column (md:grid-cols-3), Mobile: 2-column (grid-cols-2)
- Product cards: hover reveals quick-view overlay, 4:5 aspect ratio image, product name, starting price, quick color/style indicators (colored dots)
- Lazy loading for performance

### Advanced Filter Sidebar
Sticky left sidebar (desktop) / Slide-out drawer (mobile):
- Filter groups: Color (color swatches), Style (checkboxes), Fabric (radio buttons), Price Range (dual slider), Occasion (multi-select chips)
- Active filters display at top with clear-all option
- Tag-based filtering system matching admin-defined tags
- Filter count indicators (e.g., "Color (8)")

### Product Customization Interface
On product detail page:
- Large image gallery (primary + 4-6 detail shots) with zoom capability
- Customization panel: Visual selectors for color (swatches), style dropdown, design options with thumbnail previews
- Live filtering: "See similar products" button triggers filtered grid overlay
- Selected attributes display as chips above product description

### Shopping Cart
Slide-out cart drawer from right:
- Line items with thumbnail, name, quantity adjuster, remove option
- Subtotal prominently displayed
- "Continue Shopping" and "Checkout" CTAs
- Empty state with suggested products

### Admin Panel
Utility-focused design (separate aesthetic from storefront):
- Sidebar navigation: Dashboard, Products, Tags, Orders
- Product management table with inline editing
- Tag creation interface with color-coding and category assignment
- Bulk actions for efficient inventory management
- Image upload with drag-drop, crop, and reorder functionality

## Component Library

**Buttons:**
- Primary: Rounded, medium height (h-12), bold text
- Secondary: Outlined variant
- Icon buttons: Square (w-10 h-10) for cart, favorites, etc.

**Cards:**
- Product cards: Minimal border, shadow on hover
- Filter cards: Grouped sections with subtle dividers (border-b)

**Form Elements:**
- Input fields: Rounded borders, focus ring, consistent h-12
- Dropdowns: Custom styled with chevron icon
- Checkboxes/Radio: Larger touch targets (w-5 h-5)

**Badges & Tags:**
- Rounded-full pills for active filters
- Small badges for "New", "Sale", stock status
- Color-coded category tags

## Images
**Hero:** 3 full-width lifestyle images showing sarees in authentic settings (traditional ceremonies, cultural celebrations). High-quality, professionally styled photos featuring models wearing different saree collections. Each image 1920x800px minimum.

**Product Images:** Multiple angles per saree (full drape, fabric close-up, border detail, pallu design). Consistent white/light gray background for catalog. Minimum 6 images per product, 1200x1500px.

**Category Banners:** Medium-sized banners (1200x400px) for collection pages showing fabric textures or patterns.

## Animations
Minimal and purposeful:
- Smooth cart drawer slide-in (300ms ease)
- Product card hover lift (subtle translateY)
- Filter collapse/expand (accordion behavior)
- Image gallery transitions (crossfade)
No scroll-triggered animations

## Responsive Breakpoints
- Mobile-first approach
- sm: 640px, md: 768px, lg: 1024px, xl: 1280px
- Product grid adjusts columns at each breakpoint
- Filter sidebar becomes bottom drawer on mobile
- Navigation condenses to hamburger menu below md