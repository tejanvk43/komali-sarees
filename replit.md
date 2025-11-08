# Elegant Sarees - E-Commerce Platform

## Project Overview
A premium e-commerce platform for a saree shop featuring advanced product filtering and customization capabilities. The platform allows customers to browse and filter sarees by color, style, fabric, occasion, and price range, while store owners can manage inventory through a comprehensive admin panel.

## Architecture
- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter for client-side routing

## Key Features

### Customer-Facing Features
1. **Hero Carousel**: Auto-rotating carousel showcasing featured collections with elegant overlays
2. **Advanced Filtering System**:
   - Color filters with visual swatches
   - Fabric type selection
   - Occasion-based filtering
   - Style preferences
   - Price range slider (₹0 - ₹50,000)
3. **Product Browsing**:
   - Responsive grid layout (2-col mobile, 3-col tablet, 4-col desktop)
   - Product cards with hover effects
   - Color indicators and quick add-to-cart
4. **Product Detail View**:
   - Image gallery with navigation
   - Complete product information
   - Tag-based attribute display
   - Add to cart functionality
5. **Shopping Cart**:
   - Slide-out drawer interface
   - Quantity adjustment
   - Real-time subtotal calculation
   - Cart persistence via localStorage session

### Admin Features
1. **Product Management**:
   - Create, edit, delete products
   - Multi-image upload support
   - Stock status management
   - Featured product designation
   - Tag assignment
2. **Tag Management**:
   - Create custom tags for filtering
   - Categories: color, fabric, occasion, style, design
   - Color tags with hex values for visual swatches
   - Organized by category

## Database Schema

### Products Table
- ID, name, description, price
- Images (array of URLs)
- Fabric, occasion
- Stock status, featured flag
- Timestamps

### Tags Table
- ID, name, category
- Color hex (for color tags)
- Timestamps

### Product-Tags Junction Table
- Links products to their tags
- Enables flexible filtering

### Cart Items Table
- Session-based cart items
- Product references
- Quantity tracking

### Admin Users Table
- Admin authentication
- Username/password

## Design System

### Typography
- **Primary Font**: Playfair Display (headers, product names) - elegant serif
- **Secondary Font**: Inter (body text, UI) - clean sans-serif

### Color Scheme
- Primary: Rose/Pink (#340 75% 45%) - elegant and sophisticated
- Neutral backgrounds with subtle elevation
- High contrast for accessibility

### Layout
- Max-width containers (7xl)
- Consistent spacing primitives (2, 4, 6, 8, 12, 16, 20, 24)
- Sticky navigation
- Responsive breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/with-tags` - Products with associated tags
- `POST /api/products` - Create product (admin)
- `PATCH /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Tags
- `GET /api/tags` - List all tags
- `POST /api/tags` - Create tag (admin)
- `PATCH /api/tags/:id` - Update tag (admin)
- `DELETE /api/tags/:id` - Delete tag (admin)

### Cart
- `GET /api/cart/:sessionId` - Get cart items
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove cart item

## Recent Changes
- **2025-01-08**: Initial project setup
  - Created complete database schema with products, tags, cart, and admin tables
  - Implemented all frontend components following design guidelines
  - Generated hero and product images using AI
  - Configured Playfair Display and Inter fonts
  - Built responsive navigation with cart integration
  - Created advanced filter sidebar with color swatches, checkboxes, and price slider
  - Implemented product cards with hover effects and quick actions
  - Built product detail modal with image gallery
  - Created shopping cart drawer with quantity management
  - Developed comprehensive admin panel for product and tag management

## Development Notes
- Session-based cart uses localStorage for guest shopping
- All images are imported using @assets alias for Vite optimization
- Filter state is client-side for instant UI updates
- Product-tag relationships enable flexible filtering combinations
- Admin panel uses modal overlays for create/edit forms
- Responsive design prioritizes mobile experience

## User Preferences
- Focus on visual excellence and premium aesthetic
- Cultural sophistication appropriate for traditional Indian sarees
- Seamless filtering and customization experience
- Intuitive admin panel for inventory management
