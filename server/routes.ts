import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertTagSchema, insertCartItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/with-tags", async (req, res) => {
    try {
      const products = await storage.getProductsWithTags();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products with tags" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const { tagIds, ...productData } = req.body;
      const validated = insertProductSchema.parse(productData);
      const product = await storage.createProduct(validated, tagIds || []);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid product data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create product" });
      }
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { tagIds, ...productData } = req.body;
      const validated = insertProductSchema.partial().parse(productData);
      const product = await storage.updateProduct(id, validated, tagIds);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid product data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update product" });
      }
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Tags API
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  });

  app.post("/api/tags", async (req, res) => {
    try {
      const validated = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(validated);
      res.status(201).json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid tag data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create tag" });
      }
    }
  });

  app.patch("/api/tags/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertTagSchema.partial().parse(req.body);
      const tag = await storage.updateTag(id, validated);
      if (!tag) {
        res.status(404).json({ error: "Tag not found" });
        return;
      }
      res.json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid tag data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update tag" });
      }
    }
  });

  app.delete("/api/tags/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTag(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete tag" });
    }
  });

  // Cart API
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const items = await storage.getCartItems(sessionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validated = insertCartItemSchema.parse(req.body);
      const item = await storage.addToCart(validated);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid cart item data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to add to cart" });
      }
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      // Validate quantity
      const quantitySchema = z.number().int().min(1).max(99);
      const validatedQuantity = quantitySchema.parse(quantity);
      
      const item = await storage.updateCartItem(id, validatedQuantity);
      if (!item) {
        res.status(404).json({ error: "Cart item not found" });
        return;
      }
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid quantity", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update cart item" });
      }
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.removeCartItem(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
