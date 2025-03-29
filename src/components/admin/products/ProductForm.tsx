'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { Loader2, Upload, Trash, ImageIcon, Plus } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be a positive number'),
  stock: z.number().min(0, 'Stock must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  isFeatured: z.boolean().optional(),
  minOrderQuantity: z.number().min(1, 'Minimum order quantity must be at least 1'),
  customizable: z.boolean().optional(),
  leadTime: z.string().optional(),
  material: z.string().optional(),
  certification: z.array(z.string()).optional(),
  origin: z.string().optional(),
  packagingInfo: z.string().optional(),
  tradeTerms: z.array(z.string()).optional(),
  sampleAvailable: z.boolean().optional(),
  samplePrice: z.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category?: string;
    isFeatured: boolean;
    images: string[];
    minOrderQuantity: number;
    customizable: boolean;
    leadTime?: string;
    material?: string;
    certification: string[];
    origin?: string;
    packagingInfo?: string;
    tradeTerms: string[];
    sampleAvailable: boolean;
    samplePrice?: number;
  };
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<{file: File, preview: string}[]>([]);

  const defaultValues: ProductFormData = {
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    category: product?.category || '',
    isFeatured: product?.isFeatured || false,
    minOrderQuantity: product?.minOrderQuantity || 1,
    customizable: product?.customizable || false,
    leadTime: product?.leadTime || '',
    material: product?.material || '',
    certification: product?.certification || [],
    origin: product?.origin || '',
    packagingInfo: product?.packagingInfo || '',
    tradeTerms: product?.tradeTerms || [],
    sampleAvailable: product?.sampleAvailable || false,
    samplePrice: product?.samplePrice || 0,
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const sampleAvailable = watch('sampleAvailable');

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleRemovePreviewImage = (index: number) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImages(prev => [
          ...prev, 
          {
            file,
            preview: reader.result as string
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImageToServer = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to upload image');
          }
          
          const data = await response.json();
          resolve(data.url);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
  const handleUploadImages = async () => {
    if (previewImages.length === 0) return;
    
    setIsUploading(true);
    try {
      const uploadPromises = previewImages.map(item => uploadImageToServer(item.file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setImages([...images, ...uploadedUrls]);
      setPreviewImages([]);
      
      toast.success(`${uploadedUrls.length} images uploaded successfully`);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload one or more images');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    if (previewImages.length > 0) {
      const shouldContinue = window.confirm('You have images that haven\'t been uploaded yet. Do you want to upload them before saving the product?');
      if (shouldContinue) {
        await handleUploadImages();
      }
    }

    setIsSubmitting(true);
    try {
      const productData = {
        ...data,
        samplePrice: data.sampleAvailable ? data.samplePrice : null,
        images: images,
      };

      const url = product
        ? `/api/products/${product.id}`
        : '/api/products';
      const method = product ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      toast.success(product ? 'Product updated' : 'Product created');
      router.push('/dashboard/products');
      router.refresh();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            {...register('stock', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="0"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          {...register('category')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          <option value="jewelry-boxes">Jewelry Boxes</option>
          <option value="jewelry-display-stands">Jewelry Display Stands</option>
          <option value="jewelry-display-props">Jewelry Display Props</option>
          <option value="jewelry-display-trays">Jewelry Display Trays</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Minimum Order Quantity
        </label>
        <input
          type="number"
          {...register('minOrderQuantity', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="1"
        />
        {errors.minOrderQuantity && (
          <p className="mt-1 text-sm text-red-600">{errors.minOrderQuantity.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Material
        </label>
        <input
          type="text"
          {...register('material')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Lead Time
        </label>
        <input
          type="text"
          {...register('leadTime')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., 2-3 weeks"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Packaging Info
        </label>
        <textarea
          {...register('packagingInfo')}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('customizable')}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Customizable Product
        </label>
      </div>

      <div className="space-y-4">
        <Label>Product Images</Label>
        
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="text-center py-4">
              <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 mb-2">Upload product images</p>
              <div className="flex justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="mr-2"
                >
                  Select Files
                </Button>
                <Button 
                  type="button"
                  disabled={previewImages.length === 0 || isUploading}
                  onClick={handleUploadImages}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {previewImages.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Ready to Upload</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {previewImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-md overflow-hidden border">
                        <Image 
                          src={img.preview} 
                          alt={`Preview ${index}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemovePreviewImage(index)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex space-x-2">
          <Input 
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Or enter image URL manually"
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={handleAddImage}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {images.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Product Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {images.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-md overflow-hidden border">
                    <Image 
                      src={url} 
                      alt={`Product image ${index}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border rounded-lg p-6 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Sample Information</h3>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('sampleAvailable')}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Sample Available
          </label>
        </div>

        {sampleAvailable && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sample Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register('samplePrice', { valueAsNumber: true })}
                className="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            {errors.samplePrice && (
              <p className="mt-1 text-sm text-red-600">{errors.samplePrice.message}</p>
            )}
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p>Enable this option if you want to offer product samples to potential buyers.</p>
          <p className="mt-1">Sample price should typically be lower than the regular product price.</p>
          {!product && (
            <p className="mt-2 text-amber-600 font-medium">Note: Sample functionality will only be available after the product is created.</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register('isFeatured')}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label className="block text-sm text-gray-900">
          Feature this product on homepage
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/dashboard/products')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isSubmitting
            ? 'Saving...'
            : product
            ? 'Update Product'
            : 'Create Product'}
        </button>
      </div>
    </form>
  );
} 