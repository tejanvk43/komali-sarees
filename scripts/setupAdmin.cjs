const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

const ADMIN_EMAIL = "admin@komalisarees.com";
const ADMIN_PASSWORD = "Password123!"; // Change this!

async function setup() {
    try {
        // 1. Create Auth User
        console.log(`Creating user ${ADMIN_EMAIL}...`);
        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(ADMIN_EMAIL);
            console.log("User already exists:", userRecord.uid);
        } catch (e) {
            userRecord = await auth.createUser({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                emailVerified: true,
            });
            console.log("User created:", userRecord.uid);
        }

        // 2. Create Admin Doc in Firestore
        console.log("Setting up admin privileges...");
        await db.collection("admins").doc(userRecord.uid).set({
            email: ADMIN_EMAIL,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            role: "superadmin"
        });
        console.log("Admin privileges granted.");

        // 3. Create Initial Collections (Optional - just to initialize DB)
        console.log("Initializing collections...");

        // Create a dummy product to ensure collection exists
        // await db.collection("products").doc("_init").set({
        //   _info: "Initialization doc",
        //   createdAt: admin.firestore.FieldValue.serverTimestamp()
        // });

        console.log("Setup complete!");
        console.log(`Login with: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
        process.exit(0);

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

setup();
