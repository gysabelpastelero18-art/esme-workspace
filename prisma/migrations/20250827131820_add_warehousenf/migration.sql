-- CreateTable
CREATE TABLE "public"."WarehouseNF" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "pcsKg" DOUBLE PRECISION,
    "grams" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "amount" DOUBLE PRECISION,
    "category" TEXT,
    "department" TEXT,
    "group" TEXT,
    "branch" TEXT,
    "unit" TEXT,
    "location" TEXT,
    "dateEncoded" TIMESTAMP(3),
    "encodedBy" TEXT,
    "countedBy" TEXT,
    "checkedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarehouseNF_pkey" PRIMARY KEY ("id")
);
