const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// Updated data structure with images array
const products = [
    {
        id: '1',
        name: 'Royal Kanjivaram Silk Saree',
        price: 15000,
        description: 'Handwoven Kanjivaram silk saree with pure zari border. Features intricate peacock motifs and a rich pallu.',
        images: [
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
            'https://images.unsplash.com/photo-1610030469668-965d05a1b9f4?w=800&q=80'
        ],
        fabric: 'Kanjivaram Silk',
        occasion: 'Wedding',
        color: 'Red',
        stock: 5,
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Banarasi Georgette Saree',
        price: 8500,
        description: 'Lightweight Banarasi Georgette saree with floral jaal work. Perfect for evening parties and festivals.',
        images: [
            'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
            'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80'
        ],
        fabric: 'Georgette',
        occasion: 'Party',
        color: 'Blue',
        stock: 8,
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Handloom Cotton Saree',
        price: 2500,
        description: 'Comfortable and elegant handloom cotton saree. Ideal for daily wear and office use.',
        images: [
            'https://images.unsplash.com/photo-1610030469839-bec246ef06e5?w=800&q=80',
            'https://images.unsplash.com/photo-1610030469841-294f463a540a?w=800&q=80'
        ],
        fabric: 'Cotton',
        occasion: 'Casual',
        color: 'Green',
        stock: 15,
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        name: 'Mysore Silk Saree',
        price: 6000,
        description: 'Soft and lustrous Mysore silk saree with gold border. Known for its smooth texture and vibrant colors.',
        images: [
            'https://images.unsplash.com/photo-1583391733975-6c78276477e2?w=800&q=80',
            'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80'
        ],
        fabric: 'Mysore Silk',
        occasion: 'Festival',
        color: 'Pink',
        stock: 10,
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        name: 'Chanderi Silk Cotton Saree',
        price: 4500,
        description: 'Traditional Chanderi saree blending silk and cotton. Features lightweight texture and sheer transparency.',
        images: [
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
            'https://images.unsplash.com/photo-1610030469668-965d05a1b9f4?w=800&q=80'
        ],
        fabric: 'Chanderi',
        occasion: 'Formal',
        color: 'Yellow',
        stock: 12,
        createdAt: new Date().toISOString()
    },
    {
        id: '6',
        name: 'Tussar Silk Saree',
        price: 9000,
        description: 'Rich textured Tussar silk saree in natural gold color. Adorned with tribal art paintings.',
        images: [
            'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
            'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80'
        ],
        fabric: 'Tussar Silk',
        occasion: 'Party',
        color: 'Beige',
        stock: 6,
        createdAt: new Date().toISOString()
    }
];

async function migrate() {
    const batch = db.batch();
    console.log(`Migrating ${products.length} products...`);

    products.forEach((product) => {
        const docRef = db.collection("products").doc(product.id);
        batch.set(docRef, {
            ...product,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            migrated: true
        }, { merge: true });
    });

    await batch.commit();
    console.log("Migration complete!");
    process.exit(0);
}

migrate().catch(console.error);
