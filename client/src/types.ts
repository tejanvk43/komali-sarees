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
    dressType?: string;
    updatedAt?: string;
    createdAt?: string;
    featured?: boolean;
}

export interface Tag {
    id: string;
    name: string;
    category: 'fabric' | 'color' | 'occasion' | 'style' | 'dressType';
    colorHex?: string | null;
    createdAt: any;
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

export interface FilterState {
    colors: string[];
    fabrics: string[];
    occasions: string[];
    styles: string[];
    dressTypes: string[];
    priceRange: [number, number];
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    isAdmin?: boolean;
    createdAt?: string;
}
