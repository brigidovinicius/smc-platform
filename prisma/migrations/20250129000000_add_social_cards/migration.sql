-- CreateTable
CREATE TABLE "SocialCard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "cardData" TEXT NOT NULL,
    "themeId" TEXT,
    "useCustomColors" BOOLEAN NOT NULL DEFAULT false,
    "customBaseColor" TEXT,
    "customComplementaryColor" TEXT,
    "customAccentColor" TEXT,
    "founderPhotoUrl" TEXT,
    "businessLogoUrl" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialCard_userId_idx" ON "SocialCard"("userId");

-- CreateIndex
CREATE INDEX "SocialCard_mode_idx" ON "SocialCard"("mode");

-- CreateIndex
CREATE INDEX "SocialCard_createdAt_idx" ON "SocialCard"("createdAt");

-- AddForeignKey
ALTER TABLE "SocialCard" ADD CONSTRAINT "SocialCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

