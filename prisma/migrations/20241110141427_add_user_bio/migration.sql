-- CreateTable
CREATE TABLE "UserBio" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "jsonKey" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "UserBio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBio_userId_jsonKey_key" ON "UserBio"("userId", "jsonKey");

-- AddForeignKey
ALTER TABLE "UserBio" ADD CONSTRAINT "UserBio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
