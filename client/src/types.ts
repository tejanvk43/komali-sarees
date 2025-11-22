export interface Product {
    id: string;
    name: string;
    slug?: string;
    description: string;
    shortDescription?: string;
    price: string | number;
    discountPrice?: string | number;
    images: string[];
    gallery?: string[];
    categoryId?: string;
    clothTypeId?: string;
    tags: { id: string; name: string; category: string }[];
    sizes?: string[];
    colors?: string[];
    stock?: number;
    rating?: number;
    reviews?: number;
    fabric: string;
    occasion: string;
    color: string;
    updatedAt?: string;
    createdAt?: string;
}

export interface Tag {
    id: string;
    name: string;
    category: string;
    colorHex: string | null;
    createdAt: Date;
}

export interface ProductWithTags extends Product {
    tags: Tag[];
}

export interface CartItem {
    id: string;
    sessionId: string;
    productId: string;
    quantity: number;
    createdAt: Date;
}

export interface CartItemWithProduct extends CartItem {
    product: Product;
}
