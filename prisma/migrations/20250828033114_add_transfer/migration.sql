-- CreateTable
CREATE TABLE "public"."Transfer" (
    "id" SERIAL NOT NULL,
    "Group" TEXT NOT NULL,
    "TransDate" TIMESTAMP(3) NOT NULL,
    "DRNo" TEXT NOT NULL,
    "Branch" TEXT NOT NULL,
    "Department" TEXT NOT NULL,
    "Category" TEXT NOT NULL,
    "Item" TEXT NOT NULL,
    "Qty" DOUBLE PRECISION NOT NULL,
    "Unit" TEXT NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "Amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);
