import {
  products,
  tags,
  productTags,
  cartItems,
  adminUsers,
  type Product,
  type Tag,
  type ProductTag,
  type CartItem,
  type AdminUser,
  type InsertProduct,
  type InsertTag,
  type InsertProductTag,
  type InsertCartItem,
  type InsertAdminUser,
  type ProductWithTags,
  type CartItemWithProduct,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProductsWithTags(): Promise<ProductWithTags[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct, tagIds: string[]): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>, tagIds?: string[]): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;

  // Tags
  getTags(): Promise<Tag[]>;
  getTag(id: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  updateTag(id: string, tag: Partial<InsertTag>): Promise<Tag | undefined>;
  deleteTag(id: string): Promise<void>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: string): Promise<void>;

  // Admin
  getAdminUser(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsWithTags(): Promise<ProductWithTags[]> {
    const allProducts = await db.select().from(products);
    const allProductTags = await db
      .select()
      .from(productTags)
      .innerJoin(tags, eq(productTags.tagId, tags.id));

    return allProducts.map(product => ({
      ...product,
      tags: allProductTags
        .filter(pt => pt.product_tags.productId === product.id)
        .map(pt => pt.tags),
    }));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct, tagIds: string[]): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();

    if (tagIds.length > 0) {
      await db.insert(productTags).values(
        tagIds.map(tagId => ({
          productId: newProduct.id,
          tagId,
        }))
      );
    }

    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>, tagIds?: string[]): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();

    if (tagIds !== undefined) {
      await db.delete(productTags).where(eq(productTags.productId, id));
      if (tagIds.length > 0) {
        await db.insert(productTags).values(
          tagIds.map(tagId => ({
            productId: id,
            tagId,
          }))
        );
      }
    }

    return updated || undefined;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags);
  }

  async getTag(id: string): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag || undefined;
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db
      .insert(tags)
      .values(tag)
      .returning();
    return newTag;
  }

  async updateTag(id: string, tag: Partial<InsertTag>): Promise<Tag | undefined> {
    const [updated] = await db
      .update(tags)
      .set(tag)
      .where(eq(tags.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteTag(id: string): Promise<void> {
    await db.delete(tags).where(eq(tags.id, id));
  }

  // Cart
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = await db
      .select()
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.sessionId, sessionId));

    return items.map(item => ({
      ...item.cart_items,
      product: item.products,
    }));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const existing = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.sessionId, item.sessionId),
          eq(cartItems.productId, item.productId)
        )
      );

    if (existing.length > 0) {
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: existing[0].quantity + item.quantity })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return updated;
    }

    const [newItem] = await db
      .insert(cartItems)
      .values(item)
      .returning();
    return newItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated || undefined;
  }

  async removeCartItem(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  // Admin
  async getAdminUser(username: string): Promise<AdminUser | undefined> {
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username));
    return user || undefined;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [newUser] = await db
      .insert(adminUsers)
      .values(user)
      .returning();
    return newUser;
  }
}

export const storage = new DatabaseStorage();
