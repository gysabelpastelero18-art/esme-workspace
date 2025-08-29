/*
  Warnings:

  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."items";

-- CreateTable
CREATE TABLE "public"."Item" (
    "MID" SERIAL NOT NULL,
    "MDate" TIMESTAMP(3),
    "EKCode" VARCHAR(50),
    "Barcode" VARCHAR(50),
    "ItemCode" VARCHAR(50),
    "FoodGroup" VARCHAR(50),
    "FGCode" VARCHAR(50),
    "Category" VARCHAR(50),
    "FCCode" VARCHAR(50),
    "Subcategory" VARCHAR(50),
    "FSCCode" VARCHAR(50),
    "Department" VARCHAR(50),
    "Supplier" VARCHAR(100),
    "ItemDesc" VARCHAR(255),
    "Item" VARCHAR(100),
    "Brand" VARCHAR(100),
    "UOMQty" DOUBLE PRECISION,
    "Unit" VARCHAR(20),
    "CUOMQty" DOUBLE PRECISION,
    "CUnit" VARCHAR(20),
    "Location" VARCHAR(50),
    "Storage" VARCHAR(50),
    "Container" VARCHAR(50),
    "ForBarcode" BOOLEAN,
    "EncodedBy" VARCHAR(50),
    "Status" VARCHAR(20),
    "ForInv" BOOLEAN,
    "EkNum" VARCHAR(50),
    "BGroup" VARCHAR(50),
    "PCSPerPack" INTEGER,
    "PricePc" DOUBLE PRECISION,
    "Price" DOUBLE PRECISION,
    "UInv" VARCHAR(50),

    CONSTRAINT "Item_pkey" PRIMARY KEY ("MID")
);
