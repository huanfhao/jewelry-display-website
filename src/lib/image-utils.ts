/**
 * 图片优化工具库
 */

// 支持的图片格式
const SUPPORTED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'];

/**
 * 获取优化后的图片URL
 * @param url 原始图片URL
 * @param options 优化选项
 * @returns 优化后的URL
 */
export function getOptimizedImageUrl(
  url: string, 
  options: { 
    width?: number; 
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif';
  } = {}
): string {
  // 处理空URL
  if (!url) return '/images/hero.jpg';
  
  // 处理相对路径
  if (url.startsWith('/')) {
    return url;
  }
  
  // 处理Cloudinary图片
  if (url && url.startsWith('https://res.cloudinary.com/')) {
    // 构建参数
    const params = new URLSearchParams();
    
    // 设置宽度
    if (options.width) {
      params.append('w', options.width.toString());
    }
    
    // 设置高度
    if (options.height) {
      params.append('h', options.height.toString());
    }
    
    // 设置质量
    params.append('q', (options.quality || 80).toString());
    
    // 设置格式转换
    if (options.format && options.format !== 'auto') {
      params.append('f', options.format);
    }
    
    // 添加自动优化
    params.append('c', 'fill');      // 裁剪方式
    params.append('g', 'auto:good'); // 智能裁剪
    
    // 构建最终URL
    const queryString = params.toString();
    const optimizedUrl = url.includes('?') 
      ? `${url}&${queryString}`
      : `${url}?${queryString}`;
    
    // 使用图片代理
    return `/api/image-proxy?url=${encodeURIComponent(optimizedUrl)}`;
  }
  
  // 其他外部URL，通过代理
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

/**
 * 根据设备屏幕大小和容器宽度决定最佳图片宽度
 * @param containerWidth 容器宽度百分比（0-100）
 * @returns 推荐的图片宽度
 */
export function getResponsiveImageWidth(containerWidth: number = 100): number {
  if (typeof window === 'undefined') return 1200; // 服务器端渲染默认值
  
  const screenWidth = window.innerWidth;
  const estimatedWidth = Math.round((screenWidth * containerWidth) / 100);
  
  // 根据估计宽度找到最接近的设备宽度
  const deviceSizes = [360, 480, 640, 750, 828, 1080, 1200, 1920, 2048];
  
  // 找到第一个大于估计宽度的尺寸
  const optimalSize = deviceSizes.find(size => size >= estimatedWidth) || deviceSizes[deviceSizes.length - 1];
  
  return optimalSize;
}

/**
 * 生成图片的占位符颜色
 * @param seed 图片URL或其他唯一标识符
 * @returns CSS颜色字符串
 */
export function generatePlaceholderColor(seed: string): string {
  // 简单的字符串哈希函数
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash; // 转换为32位整数
  }
  
  // 生成柔和的背景色
  const h = (Math.abs(hash) % 360); // 色相
  const s = 20 + (Math.abs(hash) % 20); // 饱和度 20-40%
  const l = 85 + (Math.abs(hash) % 10); // 亮度 85-95%
  
  return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * 检测图片URL是否有效
 * @param url 图片URL
 * @returns 是否为有效图片URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  // 检查是否为相对路径
  if (url.startsWith('/')) return true;
  
  try {
    const parsedUrl = new URL(url);
    
    // 检查协议
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) return false;
    
    // 检查文件扩展名
    const pathname = parsedUrl.pathname.toLowerCase();
    return SUPPORTED_FORMATS.some(ext => pathname.endsWith(`.${ext}`));
  } catch {
    return false;
  }
}

/**
 * 生成图片尺寸集合，用于响应式图片
 * @param url 基础图片URL
 * @param widths 需要生成的宽度数组
 * @returns srcset字符串
 */
export function generateSrcSet(url: string, widths: number[] = [640, 750, 828, 1080, 1200, 1920]): string {
  return widths
    .map(width => `${getOptimizedImageUrl(url, { width, quality: 80 })} ${width}w`)
    .join(', ');
} 