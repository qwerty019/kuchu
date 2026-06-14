-- CreateTable
CREATE TABLE "Filter" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilterOption" (
    "id" SERIAL NOT NULL,
    "filterId" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "FilterOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodFilter" (
    "id" SERIAL NOT NULL,
    "goodId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,

    CONSTRAINT "GoodFilter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoodFilter_goodId_optionId_key" ON "GoodFilter"("goodId", "optionId");

-- AddForeignKey
ALTER TABLE "FilterOption" ADD CONSTRAINT "FilterOption_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "Filter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodFilter" ADD CONSTRAINT "GoodFilter_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodFilter" ADD CONSTRAINT "GoodFilter_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "FilterOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
