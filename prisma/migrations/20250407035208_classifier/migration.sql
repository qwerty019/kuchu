-- CreateTable
CREATE TABLE "Classifier" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Classifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassGood" (
    "id" SERIAL NOT NULL,
    "goodId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "ClassGood_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClassGood" ADD CONSTRAINT "ClassGood_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassGood" ADD CONSTRAINT "ClassGood_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Classifier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
