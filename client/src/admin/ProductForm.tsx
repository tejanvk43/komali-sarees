import { useState } from "react";
import { useForm } from "react-hook-form";
import { Product } from "@/types";
import { saveProduct } from "@/utils/firestore";
import { uploadFileWithProgress, deleteFileFromUrl } from "@/utils/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, GripVertical, Trash2 } from "lucide-react";

export function ProductForm({ initialData, onSuccess }: { initialData?: Product, onSuccess: () => void }) {
  const { register, handleSubmit, setValue, watch } = useForm<Product>({ 
    defaultValues: {
      ...initialData,
      images: initialData?.images || [],
      tags: initialData?.tags || []
    } 
  });
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const currentImages = watch("images") || [];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Validation
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(files[i].type)) {
        alert(`File ${files[i].name} is not a valid image (JPG, PNG, WEBP only).`);
        return;
      }
      totalSize += files[i].size;
    }
    if (totalSize > 100 * 1024 * 1024) { // 100MB Limit
      alert("Total upload size exceeds 100MB limit.");
      return;
    }

    setUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `products/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        
        await new Promise<void>((resolve, reject) => {
          uploadFileWithProgress(file, path, (status) => {
            setUploadProgress(prev => ({ ...prev, [file.name]: status.progress }));
            if (status.state === 'success' && status.downloadURL) {
              newImageUrls.push(status.downloadURL);
              resolve();
            } else if (status.state === 'error') {
              reject(new Error(status.error));
            }
          });
        });
      }

      setValue("images", [...currentImages, ...newImageUrls]);
      
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console.");
    } finally {
      setUploading(false);
      setUploadProgress({});
      e.target.value = "";
    }
  };

  const removeImage = async (indexToRemove: number) => {
    const urlToRemove = currentImages[indexToRemove];
    if (confirm("Delete this image? This cannot be undone.")) {
      try {
        // Only try to delete from storage if it's a firebase URL
        if (urlToRemove.includes("firebasestorage")) {
          await deleteFileFromUrl(urlToRemove);
        }
        setValue("images", currentImages.filter((_, index) => index !== indexToRemove));
      } catch (e) {
        console.error("Failed to delete image from storage", e);
        // Still remove from list if storage delete fails (orphan cleanup can happen later)
        setValue("images", currentImages.filter((_, index) => index !== indexToRemove));
      }
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= currentImages.length) return;
    const updated = [...currentImages];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setValue("images", updated);
  };

  const onSubmit = async (data: Product) => {
    try {
      await saveProduct({ 
        ...data, 
        id: data.id || crypto.randomUUID(),
        price: Number(data.price),
        stock: Number(data.stock || 0)
      });
      onSuccess();
    } catch (e) {
      console.error(e);
      alert("Failed to save product");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Name</label>
          <Input {...register("name")} placeholder="Kanjivaram Silk Saree" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Price (₹)</label>
          <Input {...register("price")} type="number" placeholder="15000" required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea {...register("description")} placeholder="Detailed product description..." rows={4} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Fabric</label>
          <Input {...register("fabric")} placeholder="Silk" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Color</label>
          <Input {...register("color")} placeholder="Red" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Occasion</label>
          <Input {...register("occasion")} placeholder="Wedding" />
        </div>
      </div>

      <div className="border p-4 rounded-lg bg-gray-50">
        <label className="block mb-3 text-sm font-medium">Product Images (First image is cover)</label>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          {currentImages.map((url, index) => (
            <div key={url} className="relative group aspect-[3/4] bg-gray-200 rounded overflow-hidden border">
              <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button type="button" onClick={() => moveImage(index, index - 1)} disabled={index === 0} className="p-1 bg-white rounded hover:bg-gray-100 disabled:opacity-50">
                  <GripVertical className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => removeImage(index)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">Cover</div>
              )}
            </div>
          ))}
          
          <label className="flex flex-col items-center justify-center aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors relative">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-xs text-gray-500">{uploading ? 'Uploading...' : 'Add Images'}</span>
            <input type="file" multiple accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} disabled={uploading} className="hidden" />
            
            {/* Progress Bar Overlay */}
            {uploading && (
               <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                 <div className="w-3/4 h-2 bg-gray-200 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 animate-pulse w-full"></div>
                 </div>
               </div>
            )}
          </label>
        </div>
        <p className="text-xs text-gray-500">Supported: JPG, PNG, WEBP. Max 20MB per file.</p>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
}
