-- CreateTable
CREATE TABLE "public"."Inventory" (
    "id" SERIAL NOT NULL,
    "item" TEXT NOT NULL,
    "pcsKg" DOUBLE PRECISION,
    "grams" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "amount" DOUBLE PRECISION,
    "category" TEXT,
    "department" TEXT,
    "branch" TEXT,
    "dateEncoded" TIMESTAMP(3),
    "encodedBy" TEXT,
    "countedBy" TEXT,
    "checkedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);
