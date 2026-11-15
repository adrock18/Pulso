-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Applicability" AS ENUM ('AVAILABLE', 'UNKNOWN', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFamily" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "gender" TEXT,
    "description" TEXT,

    CONSTRAINT "ProductFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "gender" TEXT NOT NULL,
    "priceRange" TEXT,
    "familyId" TEXT NOT NULL,
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "verifiedReviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spec" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "unit" TEXT,
    "category" TEXT NOT NULL,
    "applicability" "Applicability" NOT NULL DEFAULT 'AVAILABLE',
    "source" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Spec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSerial" (
    "id" TEXT NOT NULL,
    "hashedSerial" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "claimed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProductSerial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProduct" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serialId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userProductId" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "overallRating" INTEGER NOT NULL,
    "batteryRating" INTEGER,
    "buildRating" INTEGER,
    "easeOfUseRating" INTEGER,
    "performanceRating" INTEGER,
    "valueRating" INTEGER,
    "positiveText" TEXT,
    "negativeText" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "retailer" TEXT,
    "status" "ModerationStatus" NOT NULL DEFAULT 'PUBLISHED',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Spec_productId_key_key" ON "Spec"("productId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSerial_hashedSerial_key" ON "ProductSerial"("hashedSerial");

-- CreateIndex
CREATE UNIQUE INDEX "UserProduct_serialId_key" ON "UserProduct"("serialId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userProductId_key" ON "Review"("userProductId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_productId_key" ON "Review"("userId", "productId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "ProductFamily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spec" ADD CONSTRAINT "Spec_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSerial" ADD CONSTRAINT "ProductSerial_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProduct" ADD CONSTRAINT "UserProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProduct" ADD CONSTRAINT "UserProduct_serialId_fkey" FOREIGN KEY ("serialId") REFERENCES "ProductSerial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userProductId_fkey" FOREIGN KEY ("userProductId") REFERENCES "UserProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
