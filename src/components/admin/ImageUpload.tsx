'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const validateFile = (file: File) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      throw new Error(`文件 "${file.name}" 不是图片格式`);
    }
    
    // 检查文件大小 (限制为5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error(`文件 "${file.name}" 超过5MB限制`);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    // 检查是否超过最大图片数量
    if (images.length + files.length > maxImages) {
      setError(`最多只能上传${maxImages}张图片`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      // 验证所有文件
      Array.from(files).forEach(validateFile);

      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('file', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '上传失败');
      }

      const data = await response.json();
      
      if (!data.urls || !Array.isArray(data.urls)) {
        throw new Error('服务器返回的数据格式错误');
      }

      onChange([...images, ...data.urls]);
      // 清除input的值，允许重复上传相同的文件
      e.target.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : '图片上传失败，请检查网络连接并重试');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={uploading || images.length >= maxImages}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              上传中...
            </>
          ) : (
            '上传图片'
          )}
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
          disabled={uploading || images.length >= maxImages}
        />
        <span className="text-sm text-gray-500">
          最多上传 {maxImages} 张图片（每张不超过5MB）
        </span>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <div key={url} className="relative aspect-square">
            <Image
              src={url}
              alt={`Product image ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 