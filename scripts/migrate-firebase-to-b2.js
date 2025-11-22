const admin = require("firebase-admin");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const axios = require("axios");
const serviceAccount = require("./service-account.json");

// --- CONFIGURATION ---
const B2_BUCKET_NAME = "komali-sarees";
const B2_REGION = "us-west-005";
const B2_ENDPOINT = "https://s3.us-west-005.backblazeb2.com";
const B2_KEY_ID = "YOUR_B2_KEY_ID";
const B2_KEY_SECRET = "YOUR_B2_KEY_SECRET";
const B2_PUBLIC_URL_BASE = "https://f005.backblazeb2.com/file/komali-sarees";

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

// Initialize B2 Client
const s3 = new S3Client({
    region: B2_REGION,
    endpoint: B2_ENDPOINT,
    credentials: {
        accessKeyId: B2_KEY_ID,
        secretAccessKey: B2_KEY_SECRET
    }
});

async function migrate(dryRun = true) {
    console.log(`Starting Migration (${dryRun ? 'DRY RUN' : 'LIVE'})...`);

    const productsSnapshot = await db.collection("products").get();
    let processedCount = 0;

    for (const doc of productsSnapshot.docs) {
        const product = doc.data();
        const images = product.images || [];
        const newImages = [];
        let changed = false;

        console.log(`Processing Product: ${product.name} (${doc.id})`);

        for (const imgUrl of images) {
            // Check if it's a Firebase Storage URL
            if (imgUrl.includes("firebasestorage.googleapis.com")) {
                try {
                    // 1. Download Image
                    console.log(`  Downloading: ${imgUrl.substring(0, 50)}...`);
                    const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
                    const buffer = Buffer.from(response.data, 'binary');
                    const contentType = response.headers['content-type'];

                    // 2. Generate B2 Key (filename)
                    // Extract filename from URL or generate new one
                    const filename = `migrated/${doc.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;

                    if (!dryRun) {
                        // 3. Upload to B2
                        console.log(`  Uploading to B2: ${filename}`);
                        await s3.send(new PutObjectCommand({
                            Bucket: B2_BUCKET_NAME,
                            Key: filename,
                            Body: buffer,
                            ContentType: contentType
                        }));

                        const newUrl = `${B2_PUBLIC_URL_BASE}/${filename}`;
                        newImages.push(newUrl);
                        changed = true;
                        console.log(`  Success! New URL: ${newUrl}`);
                    } else {
                        console.log(`  [DRY RUN] Would upload to ${filename}`);
                        newImages.push(imgUrl); // Keep old for dry run
                    }
                } catch (err) {
                    console.error(`  Failed to migrate image: ${imgUrl}`, err.message);
                    newImages.push(imgUrl); // Keep original on failure
                }
            } else {
                console.log(`  Skipping non-Firebase URL: ${imgUrl.substring(0, 30)}...`);
                newImages.push(imgUrl);
            }
        }

        // 4. Update Firestore
        if (changed && !dryRun) {
            await db.collection("products").doc(doc.id).update({
                images: newImages,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`  Updated Firestore doc ${doc.id}`);
        }
        processedCount++;
    }

    console.log(`Migration Complete. Processed ${processedCount} products.`);
}

// Run
const args = process.argv.slice(2);
const isDryRun = !args.includes("--run");
migrate(isDryRun).catch(console.error);
