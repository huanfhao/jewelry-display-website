import { NextRequest, NextResponse } from 'next/server';

// 开启动态渲染
export const dynamic = 'force-dynamic';

// 缓存配置
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24小时
const MAX_CACHE_SIZE = 50; // 最大缓存项数

// 内存缓存
type CachedImage = {
  buffer: Buffer;
  contentType: string;
  timestamp: number;
  etag?: string | null;
};

const imageCache = new Map<string, CachedImage>();

/**
 * 清理过期缓存
 */
function cleanupCache() {
  const now = Date.now();
  
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
 * 代理Cloudinary图片请求，绕过Next.js图片域名限制
 * 使用方法: /api/image-proxy?url=https://res.cloudinary.com/dihostsbg/image/upload/...
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      console.error('Image proxy error: No URL provided');
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    // 验证URL是否来自Cloudinary
    if (!url.startsWith('https://res.cloudinary.com/')) {
      console.error(`Image proxy error: Invalid URL source: ${url}`);
      return NextResponse.json(
        { error: 'Only Cloudinary URLs are supported' },
        { status: 400 }
      );
    }

    // 检查缓存
    const now = Date.now();
    const cachedImage = imageCache.get(url);
    
    if (cachedImage && now - cachedImage.timestamp < CACHE_EXPIRY) {
      console.log(`[图片代理] 缓存命中: ${url}`);
      // 缓存命中，返回缓存的图片
      return new NextResponse(cachedImage.buffer, {
        status: 200,
        headers: {
          'Content-Type': cachedImage.contentType,
          'Cache-Control': 'public, max-age=86400',
          'ETag': cachedImage.etag || `"${url}"`,
          'X-Cache': 'HIT',
        },
      });
    }
    
    console.log(`[图片代理] 缓存未命中，获取: ${url}`);
    
    // 获取图片
    const imageResponse = await fetch(url, {
      next: { revalidate: 86400 }, // 使用Next.js数据缓存
      headers: {
        'User-Agent': 'NextJS Image Proxy API',
        'Accept': 'image/*',
      },
    });
    
    if (!imageResponse.ok) {
      console.error(`[图片代理] 获取失败: ${url}, 状态码: ${imageResponse.status}`);
      return NextResponse.json(
        { error: '无法获取图片', status: imageResponse.status },
        { status: imageResponse.status }
      );
    }
    
    // 获取内容类型和ETag
    const contentType = imageResponse.headers.get('Content-Type') || 'image/jpeg';
    const etag = imageResponse.headers.get('ETag');
    
    // 获取并缓存图片内容
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    
    // 只缓存成功获取的图片
    imageCache.set(url, {
      buffer,
      contentType,
      timestamp: now,
      etag,
    });
    
    // 尝试清理过期缓存
    cleanupCache();
    
    // 返回图片
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
        'ETag': etag || `"${url}"`,
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    // 记录详细错误信息
    console.error('[图片代理] 错误:', error instanceof Error ? error.message : String(error));
    
    // 返回错误响应
    return NextResponse.json(
      { error: '图片代理服务错误' },
      { status: 500 }
    );
  }
} 