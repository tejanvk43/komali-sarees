import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { insertProductSchema, insertTagSchema } from '@shared/schema';
import type { Product, Tag, InsertProduct, InsertTag } from '@shared/schema';
import { z } from 'zod';

export default function AdminPanel() {
  const { toast } = useToast();
  const [showProductForm, setShowProductForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: tags = [] } = useQuery<Tag[]>({
    queryKey: ['/api/tags'],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-serif font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your saree collection and tags</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList data-testid="tabs-admin">
            <TabsTrigger value="products" data-testid="tab-products">
              Products ({products.length})
            </TabsTrigger>
            <TabsTrigger value="tags" data-testid="tab-tags">
              Tags ({tags.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Products</h2>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                data-testid="button-add-product"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <ProductList
              products={products}
              onEdit={(product) => {
                setEditingProduct(product);
                setShowProductForm(true);
              }}
            />
          </TabsContent>

          <TabsContent value="tags" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Tags</h2>
              <Button
                onClick={() => {
                  setEditingTag(null);
                  setShowTagForm(true);
                }}
                data-testid="button-add-tag"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </div>

            <TagList
              tags={tags}
              onEdit={(tag) => {
                setEditingTag(tag);
                setShowTagForm(true);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {showProductForm && (
        <ProductFormModal
          product={editingProduct}
          tags={tags}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {showTagForm && (
        <TagFormModal
          tag={editingTag}
          onClose={() => {
            setShowTagForm(false);
            setEditingTag(null);
          }}
        />
      )}
    </div>
  );
}

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

function ProductList({ products, onEdit }: ProductListProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product deleted',
        description: 'The product has been removed successfully',
      });
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="p-4" data-testid={`card-admin-product-${product.id}`}>
          <div className="aspect-[4/5] bg-muted rounded-md overflow-hidden mb-3">
            {product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h3 className="font-serif text-lg font-medium line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{product.fabric}</Badge>
            <Badge variant={product.inStock ? 'secondary' : 'destructive'}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>
          <p className="text-lg font-bold mb-4">
            ₹{parseFloat(product.price).toLocaleString('en-IN')}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(product)}
              data-testid={`button-edit-product-${product.id}`}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteMutation.mutate(product.id)}
              data-testid={`button-delete-product-${product.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

interface TagListProps {
  tags: Tag[];
  onEdit: (tag: Tag) => void;
}

function TagList({ tags, onEdit }: TagListProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/tags/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      toast({
        title: 'Tag deleted',
        description: 'The tag has been removed successfully',
      });
    },
  });

  const tagsByCategory = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) acc[tag.category] = [];
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  return (
    <div className="space-y-6">
      {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
        <div key={category}>
          <h3 className="text-lg font-medium mb-3 capitalize">{category} Tags</h3>
          <div className="flex flex-wrap gap-2">
            {categoryTags.map((tag) => (
              <Card
                key={tag.id}
                className="p-3 flex items-center gap-3"
                data-testid={`card-admin-tag-${tag.id}`}
              >
                {tag.colorHex && (
                  <div
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: tag.colorHex }}
                  />
                )}
                <span className="font-medium">{tag.name}</span>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(tag)}
                    data-testid={`button-edit-tag-${tag.id}`}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteMutation.mutate(tag.id)}
                    data-testid={`button-delete-tag-${tag.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ProductFormModalProps {
  product: Product | null;
  tags: Tag[];
  onClose: () => void;
}

const productFormSchema = insertProductSchema.extend({
  tagIds: z.array(z.string()).default([]),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

function ProductFormModal({ product, tags, onClose }: ProductFormModalProps) {
  const { toast } = useToast();
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '0',
      images: product?.images || [],
      fabric: product?.fabric || '',
      occasion: product?.occasion || '',
      inStock: product?.inStock ?? true,
      featured: product?.featured ?? false,
      tagIds: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductFormValues) =>
      apiRequest('POST', '/api/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product created',
        description: 'The product has been added successfully',
      });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormValues) =>
      apiRequest('PATCH', `/api/products/${product!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: 'Product updated',
        description: 'The product has been updated successfully',
      });
      onClose();
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (product) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-4 md:inset-8 lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:max-w-2xl lg:h-auto bg-background z-50 rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <Button size="icon" variant="ghost" onClick={onClose} data-testid="button-close-product-form">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[calc(100vh-16rem)] md:h-96">
              <div className="p-6 space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-product-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} data-testid="textarea-product-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" data-testid="input-product-price" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fabric"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fabric</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-product-fabric" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="occasion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occasion</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-product-occasion" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URLs (comma-separated)</FormLabel>
                      <FormControl>
                        <Textarea
                          value={field.value.join(', ')}
                          onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                          rows={3}
                          data-testid="textarea-product-images"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="inStock"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-product-in-stock"
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">In Stock</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-product-featured"
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Featured</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tagIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                        {tags.map((tag) => (
                          <div key={tag.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`tag-${tag.id}`}
                              checked={field.value.includes(tag.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, tag.id]);
                                } else {
                                  field.onChange(field.value.filter(id => id !== tag.id));
                                }
                              }}
                              data-testid={`checkbox-product-tag-${tag.id}`}
                            />
                            <Label htmlFor={`tag-${tag.id}`} className="flex items-center gap-2">
                              {tag.colorHex && (
                                <div
                                  className="w-4 h-4 rounded-full border border-border"
                                  style={{ backgroundColor: tag.colorHex }}
                                />
                              )}
                              {tag.name} ({tag.category})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-border flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                data-testid="button-cancel-product"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-product"
              >
                {product ? 'Update' : 'Create'} Product
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

interface TagFormModalProps {
  tag: Tag | null;
  onClose: () => void;
}

function TagFormModal({ tag, onClose }: TagFormModalProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertTag>({
    resolver: zodResolver(insertTagSchema),
    defaultValues: {
      name: tag?.name || '',
      category: tag?.category || 'color',
      colorHex: tag?.colorHex || '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertTag) => apiRequest('POST', '/api/tags', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      toast({
        title: 'Tag created',
        description: 'The tag has been added successfully',
      });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: InsertTag) => apiRequest('PATCH', `/api/tags/${tag!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      toast({
        title: 'Tag updated',
        description: 'The tag has been updated successfully',
      });
      onClose();
    },
  });

  const onSubmit = (data: InsertTag) => {
    if (tag) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background z-50 rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold">
            {tag ? 'Edit Tag' : 'Add Tag'}
          </h2>
          <Button size="icon" variant="ghost" onClick={onClose} data-testid="button-close-tag-form">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-tag-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        data-testid="select-tag-category"
                      >
                        <option value="color">Color</option>
                        <option value="fabric">Fabric</option>
                        <option value="occasion">Occasion</option>
                        <option value="style">Style</option>
                        <option value="design">Design</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('category') === 'color' && (
                <FormField
                  control={form.control}
                  name="colorHex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color (Hex)</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={field.value || '#000000'}
                            onChange={field.onChange}
                            className="w-20 h-12"
                            data-testid="input-tag-color"
                          />
                          <Input
                            {...field}
                            value={field.value || ''}
                            placeholder="#000000"
                            className="flex-1"
                            data-testid="input-tag-color-hex"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="p-6 border-t border-border flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                data-testid="button-cancel-tag"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-tag"
              >
                {tag ? 'Update' : 'Create'} Tag
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
