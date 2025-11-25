/*
  Warnings:

  - You are about to alter the column `price` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `mrr` on the `SaaSAsset` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `arr` on the `SaaSAsset` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `value` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'IN_CONTACT', 'PROPOSAL_SENT', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "LeadBuyerType" AS ENUM ('INVESTOR', 'COMPANY', 'INDIVIDUAL', 'OTHER');

-- AlterTable
ALTER TABLE "Offer" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "SaaSAsset" ALTER COLUMN "mrr" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "arr" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "buyerType" "LeadBuyerType" NOT NULL DEFAULT 'OTHER',
    "budgetRange" TEXT,
    "message" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "source" TEXT DEFAULT 'marketplace',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_assetId_idx" ON "Lead"("assetId");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Asset_slug_idx" ON "Asset"("slug");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
