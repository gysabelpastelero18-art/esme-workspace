-- CreateTable
CREATE TABLE "public"."NonFoodItems" (
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

    CONSTRAINT "NonFoodItems_pkey" PRIMARY KEY ("NFID")
);
