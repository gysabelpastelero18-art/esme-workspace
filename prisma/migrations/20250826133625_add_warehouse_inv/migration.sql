-- CreateTable
CREATE TABLE "public"."WarehouseInv" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "category" TEXT,
    "quantity" DOUBLE PRECISION,
    "unit" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarehouseInv_pkey" PRIMARY KEY ("id")
);
