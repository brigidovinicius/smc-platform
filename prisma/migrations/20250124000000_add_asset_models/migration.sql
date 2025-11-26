-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('ECOMMERCE', 'SAAS', 'SOFTWARE', 'WEBSITE_CONTENT', 'SOCIAL_PROFILE', 'NEWSLETTER', 'COMMUNITY_MEMBERSHIP', 'COURSE_INFOPRODUCT', 'HYBRID_BUNDLE', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED');

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "type" "AssetType" NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "askingPrice" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "suggestedMinPrice" DOUBLE PRECISION,
    "suggestedMaxPrice" DOUBLE PRECISION,
    "valuationNote" TEXT,
    "monthlyRevenue" DOUBLE PRECISION,
    "monthlyProfit" DOUBLE PRECISION,
    "mrr" DOUBLE PRECISION,
    "arr" DOUBLE PRECISION,
    "churnRate" DOUBLE PRECISION,
    "cac" DOUBLE PRECISION,
    "ltv" DOUBLE PRECISION,
    "primaryLanguage" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetFinancials" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "revenue" DOUBLE PRECISION,
    "profit" DOUBLE PRECISION,
    "expenses" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetFinancials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetPerformance" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "monthlyVisitors" INTEGER,
    "emailSubscribers" INTEGER,
    "socialFollowers" INTEGER,
    "mainChannels" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetVerification" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "flags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetModeration" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "adminReviewerId" TEXT,
    "adminStatusComment" TEXT,
    "adminSuggestedPrice" DOUBLE PRECISION,
    "adminPricingComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssetModeration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetMedia" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_slug_key" ON "Asset"("slug");

-- CreateIndex
CREATE INDEX "Asset_ownerId_idx" ON "Asset"("ownerId");

-- CreateIndex
CREATE INDEX "Asset_type_idx" ON "Asset"("type");

-- CreateIndex
CREATE INDEX "Asset_status_idx" ON "Asset"("status");

-- CreateIndex
CREATE INDEX "AssetFinancials_assetId_idx" ON "AssetFinancials"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "AssetPerformance_assetId_key" ON "AssetPerformance"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "AssetVerification_assetId_key" ON "AssetVerification"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "AssetModeration_assetId_key" ON "AssetModeration"("assetId");

-- CreateIndex
CREATE INDEX "AssetMedia_assetId_idx" ON "AssetMedia"("assetId");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetFinancials" ADD CONSTRAINT "AssetFinancials_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetPerformance" ADD CONSTRAINT "AssetPerformance_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetVerification" ADD CONSTRAINT "AssetVerification_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetModeration" ADD CONSTRAINT "AssetModeration_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetMedia" ADD CONSTRAINT "AssetMedia_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;



