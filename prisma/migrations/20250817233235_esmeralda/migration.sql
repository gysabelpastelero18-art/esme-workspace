-- CreateTable
CREATE TABLE "public"."Purchase" (
    "id" SERIAL NOT NULL,
    "Group" TEXT NOT NULL,
    "InvoiceDate" TEXT NOT NULL,
    "InvoiceNo" TEXT NOT NULL,
    "Supplier" TEXT NOT NULL,
    "Category" TEXT NOT NULL,
    "Item" TEXT NOT NULL,
    "Qty" DOUBLE PRECISION NOT NULL,
    "Unit" TEXT NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "Amount" DOUBLE PRECISION NOT NULL,
    "GramsQty" DOUBLE PRECISION NOT NULL,
    "Branch" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);
