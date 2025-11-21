/*
  Warnings:

  - You are about to alter the column `price` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `arr` on the `SaaSAsset` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `mrr` on the `SaaSAsset` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.
  - You are about to alter the column `value` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Decimal`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "buyerId" TEXT,
    "price" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Offer_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "SaaSAsset" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Offer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Offer_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("assetId", "buyerId", "createdAt", "id", "price", "sellerId", "status", "updatedAt") SELECT "assetId", "buyerId", "createdAt", "id", "price", "sellerId", "status", "updatedAt" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
CREATE INDEX "Offer_assetId_idx" ON "Offer"("assetId");
CREATE INDEX "Offer_sellerId_idx" ON "Offer"("sellerId");
CREATE INDEX "Offer_status_idx" ON "Offer"("status");
CREATE TABLE "new_SaaSAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "mrr" DECIMAL,
    "arr" DECIMAL,
    "churnRate" REAL,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SaaSAsset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SaaSAsset" ("arr", "category", "churnRate", "createdAt", "description", "id", "mrr", "name", "ownerId", "slug", "updatedAt") SELECT "arr", "category", "churnRate", "createdAt", "description", "id", "mrr", "name", "ownerId", "slug", "updatedAt" FROM "SaaSAsset";
DROP TABLE "SaaSAsset";
ALTER TABLE "new_SaaSAsset" RENAME TO "SaaSAsset";
CREATE UNIQUE INDEX "SaaSAsset_slug_key" ON "SaaSAsset"("slug");
CREATE INDEX "SaaSAsset_category_idx" ON "SaaSAsset"("category");
CREATE INDEX "SaaSAsset_ownerId_idx" ON "SaaSAsset"("ownerId");
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "value" DECIMAL NOT NULL,
    "closedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("buyerId", "closedAt", "createdAt", "id", "offerId", "sellerId", "value") SELECT "buyerId", "closedAt", "createdAt", "id", "offerId", "sellerId", "value" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
