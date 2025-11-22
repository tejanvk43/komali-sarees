import { db } from "@/firebase/client";
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy, updateDoc } from "firebase/firestore";
import { Product } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
    try {
        if (!db) return [];
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q).catch(() => getDocs(collection(db, "products")));
        if (snapshot.empty) return [];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function saveProduct(product: Product) {
    if (!db) throw new Error("Firestore not initialized");
    const docRef = doc(db, "products", product.id);
    const now = new Date().toISOString();

    await setDoc(docRef, {
        ...product,
        updatedAt: now,
        createdAt: product.createdAt || now,
        price: Number(product.price),
        stock: Number(product.stock || 0),
        images: product.images || []
    }, { merge: true });
}

export async function deleteProduct(id: string) {
    if (!db) throw new Error("Firestore not initialized");
    await deleteDoc(doc(db, "products", id));
}

export async function updateProductImages(productId: string, images: string[]) {
    if (!db) throw new Error("Firestore not initialized");
    const docRef = doc(db, "products", productId);
    await updateDoc(docRef, { images });
}
