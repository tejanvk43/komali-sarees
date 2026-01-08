import { Product } from "@/types";

const API_BASE = "/api";

export async function getAllProducts(): Promise<Product[]> {
    try {
        const response = await fetch(`${API_BASE}/products`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error("Error in getAllProducts:", e);
        return [];
    }
}

export async function saveProduct(product: Product): Promise<void> {
    const response = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error("Failed to save product");
}

export async function deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/products?id=${id}`, {
        method: "DELETE"
    });
    if (!response.ok) throw new Error("Failed to delete product");
}

export async function getTags(): Promise<any[]> {
    try {
        const response = await fetch(`${API_BASE}/tags`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error("Error in getTags:", e);
        return [];
    }
}

export async function saveTag(tag: any): Promise<void> {
    const response = await fetch(`${API_BASE}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tag)
    });
    if (!response.ok) throw new Error("Failed to save tag");
}

export async function deleteTag(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/tags?id=${id}`, {
        method: "DELETE"
    });
    if (!response.ok) throw new Error("Failed to delete tag");
}

export async function getOrders(): Promise<any[]> {
    try {
        const response = await fetch(`${API_BASE}/orders`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error("Error in getOrders:", e);
        return [];
    }
}

export async function placeOrder(order: any): Promise<void> {
    const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    });
    if (!response.ok) throw new Error("Failed to place order");
}

export async function getUserProfile(id: string): Promise<any> {
    const response = await fetch(`${API_BASE}/users?id=${id}`);
    return response.json();
}

export async function updateUserProfile(user: any): Promise<void> {
    const response = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error("Failed to update profile");
}

export async function getUserOrders(userId: string): Promise<any[]> {
    try {
        const response = await fetch(`${API_BASE}/orders?userId=${userId}`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error("Error in getUserOrders:", e);
        return [];
    }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
    const response = await fetch(`${API_BASE}/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status })
    });
    if (!response.ok) throw new Error("Failed to update order status");
}

export async function getFeedback(): Promise<any[]> {
    try {
        const response = await fetch(`${API_BASE}/feedback`);
        if (!response.ok) return [];
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error("Error in getFeedback:", e);
        return [];
    }
}
