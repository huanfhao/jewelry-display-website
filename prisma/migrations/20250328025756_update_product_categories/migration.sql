/*
  Warnings:

  - You are about to drop the column `category` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `products` table. All the data in the column will be lost.
  - Made the column `price` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "category",
DROP COLUMN "image",
DROP COLUMN "title",
ADD COLUMN     "bulkPricing" JSONB,
ADD COLUMN     "certification" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "customizable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leadTime" TEXT,
ADD COLUMN     "mainCategory" TEXT NOT NULL DEFAULT 'other',
ADD COLUMN     "material" TEXT,
ADD COLUMN     "minOrderQuantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "origin" TEXT,
ADD COLUMN     "packagingInfo" TEXT,
ADD COLUMN     "sampleAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "samplePrice" DOUBLE PRECISION,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subCategory" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tradeTerms" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "price" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyName" TEXT,
    "companySize" TEXT,
    "industry" TEXT,
    "position" TEXT,
    "address" TEXT,
    "country" TEXT,
    "taxId" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verificationDocuments" TEXT[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INQUIRY',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotations" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "terms" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid',
    "paymentTerms" TEXT,
    "shippingInfo" JSONB NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "productName" TEXT,
    "productUrl" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "inquiries_userId_idx" ON "inquiries"("userId");

-- CreateIndex
CREATE INDEX "inquiries_productId_idx" ON "inquiries"("productId");

-- CreateIndex
CREATE INDEX "inquiries_type_idx" ON "inquiries"("type");

-- CreateIndex
CREATE UNIQUE INDEX "quotations_inquiryId_key" ON "quotations"("inquiryId");

-- CreateIndex
CREATE INDEX "quotations_inquiryId_idx" ON "quotations"("inquiryId");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE INDEX "Analytics_event_idx" ON "Analytics"("event");

-- CreateIndex
CREATE INDEX "Analytics_type_idx" ON "Analytics"("type");

-- CreateIndex
CREATE INDEX "Analytics_timestamp_idx" ON "Analytics"("timestamp");
