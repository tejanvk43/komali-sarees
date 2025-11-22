import type { ProductWithTags, Tag } from "@/types";

// Helper to create tags consistent with the schema
const createTag = (id: string, name: string, category: string, colorHex: string | null = null): Tag => ({
    id,
    name,
    category,
    colorHex,
    createdAt: new Date(),
});

export const tags: Tag[] = [
    // Color tags
    createTag("color-1", "Red", "color", "#EF4444"),
    createTag("color-2", "Pink", "color", "#EC4899"),
    createTag("color-3", "Blue", "color", "#3B82F6"),
    createTag("color-4", "Green", "color", "#10B981"),
    createTag("color-5", "Purple", "color", "#8B5CF6"),
    createTag("color-6", "Gold", "color", "#F59E0B"),
    createTag("color-7", "White", "color", "#FFFFFF"),

    // Fabric tags
    createTag("fabric-1", "Cotton", "fabric"),
    createTag("fabric-2", "Silk", "fabric"),
    createTag("fabric-3", "Linen", "fabric"),
    createTag("fabric-4", "Georgette", "fabric"),
    createTag("fabric-5", "Chiffon", "fabric"),

    // Occasion tags
    createTag("occasion-1", "Wedding", "occasion"),
    createTag("occasion-2", "Party", "occasion"),
    createTag("occasion-3", "Casual", "occasion"),
    createTag("occasion-4", "Festival", "occasion"),

    // Style tags
    createTag("style-1", "Traditional", "style"),
    createTag("style-2", "Modern", "style"),
    createTag("style-3", "Printed", "style"),
    createTag("style-4", "Embroidered", "style"),
];

export const products: ProductWithTags[] = [
    {
        id: "prod-1",
        name: "Pink Cotton Saree",
        description: "Beautiful pink cotton saree perfect for casual wear and festivals. Comfortable and breathable with traditional weave patterns.",
        price: "2500",
        images: ["/attached_assets/generated_images/Hero_image_pink_cotton_saree_0efc3928-CXmJ7H5g.png"],
        fabric: "Cotton",
        occasion: "Casual",
        inStock: true,
        featured: true,
        createdAt: new Date(),
        tags: [
            createTag("color-2", "Pink", "color", "#EC4899"),
            createTag("fabric-1", "Cotton", "fabric"),
            createTag("occasion-3", "Casual", "occasion"),
            createTag("style-1", "Traditional", "style"),
        ],
    },
    {
        id: "prod-2",
        name: "Blue Designer Saree",
        description: "Stunning blue silk designer saree with intricate embroidery. Perfect for weddings and special occasions with rich traditional motifs.",
        price: "8500",
        images: ["/attached_assets/generated_images/Hero_image_blue_designer_saree_63eab45b-ivdwo58B.png"],
        fabric: "Silk",
        occasion: "Wedding",
        inStock: true,
        featured: true,
        createdAt: new Date(),
        tags: [
            createTag("color-3", "Blue", "color", "#3B82F6"),
            createTag("fabric-2", "Silk", "fabric"),
            createTag("occasion-1", "Wedding", "occasion"),
            createTag("style-4", "Embroidered", "style"),
        ],
    },
    {
        id: "prod-3",
        name: "Burgundy Silk Saree",
        description: "Elegant burgundy silk saree with beautiful weave patterns. Ideal for festive occasions and celebrations. Premium quality silk.",
        price: "6500",
        images: ["/attached_assets/generated_images/Hero_image_burgundy_silk_saree_5a3119ca-DfJNbJbM.png"],
        fabric: "Silk",
        occasion: "Festival",
        inStock: true,
        featured: false,
        createdAt: new Date(),
        tags: [
            createTag("color-1", "Red", "color", "#EF4444"),
            createTag("fabric-2", "Silk", "fabric"),
            createTag("occasion-4", "Festival", "occasion"),
            createTag("style-1", "Traditional", "style"),
        ],
    },
    {
        id: "prod-4",
        name: "Gold Embroidered Saree",
        description: "Luxurious gold-toned silk saree with detailed embroidery work. Perfect for weddings and grand celebrations.",
        price: "9500",
        images: ["/attached_assets/generated_images/Hero_image_pink_cotton_saree_0efc3928-CXmJ7H5g.png"],
        fabric: "Silk",
        occasion: "Wedding",
        inStock: true,
        featured: true,
        createdAt: new Date(),
        tags: [
            createTag("color-6", "Gold", "color", "#F59E0B"),
            createTag("fabric-2", "Silk", "fabric"),
            createTag("occasion-1", "Wedding", "occasion"),
            createTag("style-4", "Embroidered", "style"),
        ],
    },
    {
        id: "prod-5",
        name: "Green Printed Saree",
        description: "Fresh green cotton saree with beautiful floral prints. Great for daily wear and casual gatherings.",
        price: "3000",
        images: ["/attached_assets/generated_images/Hero_image_blue_designer_saree_63eab45b-ivdwo58B.png"],
        fabric: "Cotton",
        occasion: "Casual",
        inStock: true,
        featured: false,
        createdAt: new Date(),
        tags: [
            createTag("color-4", "Green", "color", "#10B981"),
            createTag("fabric-1", "Cotton", "fabric"),
            createTag("occasion-3", "Casual", "occasion"),
            createTag("style-3", "Printed", "style"),
        ],
    },
    {
        id: "prod-6",
        name: "Purple Party Saree",
        description: "Elegant purple silk saree perfect for parties and celebrations. Sophisticated design with modern touch.",
        price: "7000",
        images: ["/attached_assets/generated_images/Hero_image_burgundy_silk_saree_5a3119ca-DfJNbJbM.png"],
        fabric: "Silk",
        occasion: "Party",
        inStock: true,
        featured: false,
        createdAt: new Date(),
        tags: [
            createTag("color-5", "Purple", "color", "#8B5CF6"),
            createTag("fabric-2", "Silk", "fabric"),
            createTag("occasion-2", "Party", "occasion"),
            createTag("style-2", "Modern", "style"),
        ],
    },
];
