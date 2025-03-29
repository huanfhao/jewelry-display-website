import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { deleteImage, getPublicIdFromUrl } from '@/lib/cloudinary';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const data = await request.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Ensure sample price is only set when sample is available
    const productData = {
      ...data,
      samplePrice: data.sampleAvailable ? data.samplePrice : null,
    };

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: productData,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // 获取产品信息，包括图片URL
    const product = await prisma.product.findUnique({
      where: { id },
      select: { images: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // 删除Cloudinary上的图片
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = getPublicIdFromUrl(imageUrl);
        if (publicId) {
          try {
            await deleteImage(publicId);
          } catch (error) {
            console.error(`Failed to delete image:`, error);
            // 继续处理其他图片
          }
        }
      }
    }

    // 删除产品
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    
    // 处理外键约束错误
    if (error instanceof Error && error.message.includes('foreign key constraint')) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing inquiries or orders' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 