import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 配置 Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // 1. 验证会话
    const session = await getServerSession(authOptions);
    console.log('Session status:', session ? 'Authenticated' : 'Not authenticated');
    
    if (!session?.user?.id) {
      console.log('Authentication failed: No valid session');
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    // 2. 获取上传文件
    const formData = await request.formData();
    const files = formData.getAll('file');
    console.log('Files received:', files.length);

    if (!files?.length) {
      console.log('No files found in request');
      return NextResponse.json(
        { error: 'No files uploaded - Please select at least one file' },
        { status: 400 }
      );
    }

    // 3. 验证文件类型
    for (const file of files) {
      const fileType = (file as File).type;
      if (!fileType.startsWith('image/')) {
        console.log('Invalid file type detected:', fileType);
        return NextResponse.json(
          { error: `Invalid file type: ${fileType}. Only images are allowed.` },
          { status: 400 }
        );
      }
    }

    // 4. 上传到Cloudinary
    console.log('Starting Cloudinary upload...');
    const uploadPromises = files.map(async (file: any) => {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'products',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                console.log('File uploaded successfully:', result?.secure_url);
                resolve(result?.secure_url);
              }
            }
          );

          uploadStream.end(buffer);
        });
      } catch (error) {
        console.error('File processing error:', error);
        throw error;
      }
    });

    const urls = await Promise.all(uploadPromises);
    console.log('All files uploaded successfully');

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Upload process error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload files' },
      { status: 500 }
    );
  }
} 