/*
  Warnings:

  - Made the column `createdAt` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Publish` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Publish" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ALTER COLUMN "createdAt" SET NOT NULL;
