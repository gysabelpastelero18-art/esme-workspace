/*
  Warnings:

  - You are about to drop the column `quantity` on the `WarehouseInv` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."WarehouseInv" DROP COLUMN "quantity",
ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "branch" TEXT,
ADD COLUMN     "checkedBy" TEXT,
ADD COLUMN     "countedBy" TEXT,
ADD COLUMN     "dateEncoded" TIMESTAMP(3),
ADD COLUMN     "department" TEXT,
ADD COLUMN     "encodedBy" TEXT,
ADD COLUMN     "grams" DOUBLE PRECISION,
ADD COLUMN     "group" TEXT,
ADD COLUMN     "pcsKg" DOUBLE PRECISION,
ADD COLUMN     "price" DOUBLE PRECISION;
