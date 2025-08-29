/*
  Warnings:

  - You are about to drop the `NonFoodItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."NonFoodItems";

-- CreateTable
CREATE TABLE "public"."NonFoodItem" (
    "NFID" SERIAL NOT NULL,
    "Group" TEXT,
    "GCode" TEXT,
    "Category" TEXT,
    "CCode" TEXT,
    "SubCategory" TEXT,
    "SCCode" TEXT,
    "Brand" TEXT,
    "Item" TEXT,
    "Supplier" TEXT,
    "Price" DOUBLE PRECISION,
    "Barcode" TEXT,
    "BIRGroup" TEXT,
    "Size" TEXT,
    "Model" TEXT,
    "Serial" TEXT,
    "EncodeDate" TIMESTAMP(3),
    "EncodedBy" TEXT,
    "PCSPerPack" INTEGER,
    "PricePc" DOUBLE PRECISION,
    "Unit" TEXT,
    "SUInv" TEXT,
    "UInv" TEXT,

    CONSTRAINT "NonFoodItem_pkey" PRIMARY KEY ("NFID")
);
