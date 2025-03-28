import { NextResponse } from 'next/server';
import { isValidImageUrl } from '@/lib/image-utils';

export const dynamic = 'force-dynamic';

// 缓存配置
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24小时
const MAX_CACHE_SIZE = 100; // 最大缓存项数

// 内存缓存
type CachedImage = {
  buffer: Buffer;
  contentType: string;
  timestamp: number;
};

const imageCache = new Map<string, CachedImage>();

/**
 * 生成缓存键
 */
function getCacheKey(url: string, width?: string | null, height?: string | null, quality?: string | null, format?: string | null): string {
  return `${url}|w=${width || ''}|h=${height || ''}|q=${quality || ''}|f=${format || ''}`;
}

/**
 * 清理过期缓存和超出大小的缓存
 */
function cleanupCache() {
  // 检查缓存大小
  if (imageCache.size <= MAX_CACHE_SIZE) return;
  
  // 转换为数组并按时间戳排序
  const entries = Array.from(imageCache.entries());
  entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
  
  // 删除最旧的条目，直到缓存大小符合要求
  const entriesToDelete = entries.slice(0, entries.length - MAX_CACHE_SIZE);
  for (const [key] of entriesToDelete) {
    imageCache.delete(key);
  }
}

/**
 * 高级图片优化API
 * 支持多种优化参数
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const width = searchParams.get('width');
    const height = searchParams.get('height');
    const quality = searchParams.get('quality');
    const format = searchParams.get('format');
    
    // 验证URL
    if (!imageUrl || !isValidImageUrl(imageUrl)) {
      return NextResponse.json(
        { error: '无效的图片URL' },
        { status: 400 }
      );
    }
    
    // 生成缓存键
    const cacheKey = getCacheKey(imageUrl, width, height, quality, format);
    
    // 检查缓存
    const now = Date.now();
    const cachedImage = imageCache.get(cacheKey);
    
    if (cachedImage && now - cachedImage.timestamp < CACHE_EXPIRY) {
      console.log(`[图片优化] 缓存命中: ${imageUrl}`);
      return new NextResponse(cachedImage.buffer, {
        headers: {
          'Content-Type': cachedImage.contentType,
          'Cache-Control': 'public, max-age=86400',
          'ETag': `"${cacheKey}"`,
        },
      });
    }
    
    console.log(`[图片优化] 缓存未命中，获取: ${imageUrl}`);
    
    // 构建Cloudinary URL
    let optimizedUrl = imageUrl;
    
    if (imageUrl.includes('res.cloudinary.com')) {
      // 已经是Cloudinary URL，添加优化参数
      const separator = imageUrl.includes('?') ? '&' : '?';
      optimizedUrl = `${imageUrl}${separator}`;
      
      // 添加宽度
      if (width) {
        optimizedUrl += `w=${width}&`;
      }
      
      // 添加高度
      if (height) {
        optimizedUrl += `h=${height}&`;
      }
      
      // 添加质量
      if (quality) {
        optimizedUrl += `q=${quality}&`;
      }
      
      // 添加格式
      if (format) {
        optimizedUrl += `f=${format}&`;
      }
      
      // 添加智能裁剪
      optimizedUrl += 'c=fill&g=auto';
    }
    
    // 获取图片
    const imageResponse = await fetch(optimizedUrl, {
      headers: {
        'Accept': 'image/*',
        'User-Agent': 'NextJS Image Optimization API',
      },
    });
    
    if (!imageResponse.ok) {
      console.error(`[图片优化] 获取失败: ${imageUrl}, 状态码: ${imageResponse.status}`);
      return NextResponse.json(
        { error: '无法获取图片' },
        { status: imageResponse.status }
      );
    }
    
    // 获取响应类型和内容
    const contentType = imageResponse.headers.get('Content-Type') || 'image/jpeg';
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    
    // 更新缓存
    imageCache.set(cacheKey, {
      buffer,
      contentType,
      timestamp: now,
    });
    
    // 清理缓存
    cleanupCache();
    
    // 返回图片
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'ETag': `"${cacheKey}"`,
      },
    });
  } catch (error) {
    console.error('[图片优化] 处理错误:', error);
    return NextResponse.json(
      { error: '图片处理失败' },
      { status: 500 }
    );
  }
} 