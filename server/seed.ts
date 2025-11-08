import { db } from './db';
import { products, tags, productTags } from '@shared/schema';

async function seed() {
  console.log('Starting database seed...');

  // Import product images
  const productImages = {
    red: '/attached_assets/generated_images/Product_red_silk_saree_27240443.png',
    navy: '/attached_assets/generated_images/Product_navy_designer_saree_525e047a.png',
    green: '/attached_assets/generated_images/Product_green_banarasi_saree_24b48b27.png',
    peach: '/attached_assets/generated_images/Product_peach_georgette_saree_7061c343.png',
    magenta: '/attached_assets/generated_images/Product_magenta_kanjivaram_saree_a3631482.png',
    cream: '/attached_assets/generated_images/Product_cream_tissue_saree_bff2b421.png',
  };

  // Create tags
  const colorTags = await db.insert(tags).values([
    { name: 'Red', category: 'color', colorHex: '#DC2626' },
    { name: 'Navy Blue', category: 'color', colorHex: '#1E3A8A' },
    { name: 'Emerald Green', category: 'color', colorHex: '#059669' },
    { name: 'Peach', category: 'color', colorHex: '#FDBA74' },
    { name: 'Magenta', category: 'color', colorHex: '#DB2777' },
    { name: 'Cream', category: 'color', colorHex: '#FEF3C7' },
    { name: 'Gold', category: 'color', colorHex: '#F59E0B' },
    { name: 'Silver', category: 'color', colorHex: '#94A3B8' },
  ]).returning();

  const fabricTags = await db.insert(tags).values([
    { name: 'Silk', category: 'fabric' },
    { name: 'Cotton', category: 'fabric' },
    { name: 'Georgette', category: 'fabric' },
    { name: 'Banarasi Silk', category: 'fabric' },
    { name: 'Kanjivaram Silk', category: 'fabric' },
    { name: 'Tissue', category: 'fabric' },
  ]).returning();

  const occasionTags = await db.insert(tags).values([
    { name: 'Wedding', category: 'occasion' },
    { name: 'Party', category: 'occasion' },
    { name: 'Festive', category: 'occasion' },
    { name: 'Casual', category: 'occasion' },
    { name: 'Formal', category: 'occasion' },
  ]).returning();

  const styleTags = await db.insert(tags).values([
    { name: 'Traditional', category: 'style' },
    { name: 'Designer', category: 'style' },
    { name: 'Contemporary', category: 'style' },
    { name: 'Handloom', category: 'style' },
  ]).returning();

  const designTags = await db.insert(tags).values([
    { name: 'Zari Work', category: 'design' },
    { name: 'Embroidery', category: 'design' },
    { name: 'Brocade', category: 'design' },
    { name: 'Temple Motifs', category: 'design' },
    { name: 'Floral', category: 'design' },
  ]).returning();

  console.log('Tags created successfully');

  // Create products
  const createdProducts = await db.insert(products).values([
    {
      name: 'Royal Red Silk Saree with Golden Border',
      description: 'Exquisite red silk saree featuring intricate golden border work. Perfect for weddings and special occasions. The rich fabric drapes beautifully and the traditional design speaks of timeless elegance.',
      price: '12999.00',
      images: [productImages.red],
      fabric: 'Silk',
      occasion: 'Wedding',
      inStock: true,
      featured: true,
    },
    {
      name: 'Navy Blue Designer Saree with Silver Zari',
      description: 'Sophisticated navy blue designer saree adorned with silver zari work. Contemporary design meets traditional craftsmanship. Ideal for evening parties and formal events.',
      price: '15999.00',
      images: [productImages.navy],
      fabric: 'Silk',
      occasion: 'Party',
      inStock: true,
      featured: true,
    },
    {
      name: 'Emerald Green Banarasi Silk Saree',
      description: 'Stunning emerald green Banarasi silk saree with gold brocade work. Authentic handloom weaving technique from Varanasi. A classic choice for festive celebrations.',
      price: '18500.00',
      images: [productImages.green],
      fabric: 'Banarasi Silk',
      occasion: 'Festive',
      inStock: true,
      featured: true,
    },
    {
      name: 'Peach Georgette Saree with Embroidery',
      description: 'Delicate peach georgette saree featuring subtle embroidery and sequin work. Lightweight and comfortable, perfect for daytime events and casual gatherings.',
      price: '8999.00',
      images: [productImages.peach],
      fabric: 'Georgette',
      occasion: 'Casual',
      inStock: true,
      featured: false,
    },
    {
      name: 'Magenta Kanjivaram Silk Saree',
      description: 'Vibrant magenta Kanjivaram silk saree with contrasting golden border and traditional temple motifs. Pure silk from the weavers of Kanchipuram.',
      price: '22000.00',
      images: [productImages.magenta],
      fabric: 'Kanjivaram Silk',
      occasion: 'Wedding',
      inStock: true,
      featured: false,
    },
    {
      name: 'Cream and Gold Tissue Saree',
      description: 'Elegant cream and gold tissue saree with delicate zari work. Minimalist border design for a sophisticated look. Perfect for formal occasions.',
      price: '14500.00',
      images: [productImages.cream],
      fabric: 'Tissue',
      occasion: 'Formal',
      inStock: true,
      featured: false,
    },
  ]).returning();

  console.log('Products created successfully');

  // Link products to tags
  const productTagLinks = [
    // Product 1 - Red Silk
    { productId: createdProducts[0].id, tagId: colorTags[0].id }, // Red
    { productId: createdProducts[0].id, tagId: colorTags[6].id }, // Gold
    { productId: createdProducts[0].id, tagId: fabricTags[0].id }, // Silk
    { productId: createdProducts[0].id, tagId: occasionTags[0].id }, // Wedding
    { productId: createdProducts[0].id, tagId: styleTags[0].id }, // Traditional
    { productId: createdProducts[0].id, tagId: designTags[0].id }, // Zari Work

    // Product 2 - Navy Designer
    { productId: createdProducts[1].id, tagId: colorTags[1].id }, // Navy
    { productId: createdProducts[1].id, tagId: colorTags[7].id }, // Silver
    { productId: createdProducts[1].id, tagId: fabricTags[0].id }, // Silk
    { productId: createdProducts[1].id, tagId: occasionTags[1].id }, // Party
    { productId: createdProducts[1].id, tagId: styleTags[1].id }, // Designer
    { productId: createdProducts[1].id, tagId: designTags[0].id }, // Zari Work

    // Product 3 - Green Banarasi
    { productId: createdProducts[2].id, tagId: colorTags[2].id }, // Green
    { productId: createdProducts[2].id, tagId: colorTags[6].id }, // Gold
    { productId: createdProducts[2].id, tagId: fabricTags[3].id }, // Banarasi Silk
    { productId: createdProducts[2].id, tagId: occasionTags[2].id }, // Festive
    { productId: createdProducts[2].id, tagId: styleTags[0].id }, // Traditional
    { productId: createdProducts[2].id, tagId: styleTags[3].id }, // Handloom
    { productId: createdProducts[2].id, tagId: designTags[2].id }, // Brocade

    // Product 4 - Peach Georgette
    { productId: createdProducts[3].id, tagId: colorTags[3].id }, // Peach
    { productId: createdProducts[3].id, tagId: fabricTags[2].id }, // Georgette
    { productId: createdProducts[3].id, tagId: occasionTags[3].id }, // Casual
    { productId: createdProducts[3].id, tagId: styleTags[2].id }, // Contemporary
    { productId: createdProducts[3].id, tagId: designTags[1].id }, // Embroidery
    { productId: createdProducts[3].id, tagId: designTags[4].id }, // Floral

    // Product 5 - Magenta Kanjivaram
    { productId: createdProducts[4].id, tagId: colorTags[4].id }, // Magenta
    { productId: createdProducts[4].id, tagId: colorTags[6].id }, // Gold
    { productId: createdProducts[4].id, tagId: fabricTags[4].id }, // Kanjivaram Silk
    { productId: createdProducts[4].id, tagId: occasionTags[0].id }, // Wedding
    { productId: createdProducts[4].id, tagId: styleTags[0].id }, // Traditional
    { productId: createdProducts[4].id, tagId: designTags[3].id }, // Temple Motifs

    // Product 6 - Cream Tissue
    { productId: createdProducts[5].id, tagId: colorTags[5].id }, // Cream
    { productId: createdProducts[5].id, tagId: colorTags[6].id }, // Gold
    { productId: createdProducts[5].id, tagId: fabricTags[5].id }, // Tissue
    { productId: createdProducts[5].id, tagId: occasionTags[4].id }, // Formal
    { productId: createdProducts[5].id, tagId: styleTags[2].id }, // Contemporary
    { productId: createdProducts[5].id, tagId: designTags[0].id }, // Zari Work
  ];

  await db.insert(productTags).values(productTagLinks);

  console.log('Product-tag relationships created successfully');
  console.log('Seed completed!');
}

seed().catch(console.error);
