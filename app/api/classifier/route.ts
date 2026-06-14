export const dynamic = "force-dynamic";

import { getClassifier } from "@/lib/farmbazis/data";
import { Classifier, TovList } from "@/lib/farmbazis/definitions";
import prisma from "@/lib/prisma";

interface SimplifiedClassifier {
  title: string;
  id: number;
  tovList: TovList[];
}

export async function GET() {
  try {
    const classifiers = await getClassifier();

    if (!classifiers.length) {
      return Response.json(
        { message: "Не найдены классификаторы." },
        { status: 400 }
      );
    }

    // Function to recursively extract all classifiers with simplified structure
    const extractAllClassifiers = (
      classifiers: Classifier[]
    ): SimplifiedClassifier[] => {
      const result: SimplifiedClassifier[] = [];

      const processClassifier = (classifier: Classifier): void => {
        // Add current classifier with only required fields
        const simplifiedClassifier = {
          title: classifier.Classifier || "",
          id: classifier.id,
          // Initialize with empty array if tovList doesn't exist
          tovList: classifier.tovList || [],
        };

        if (
          simplifiedClassifier.tovList &&
          simplifiedClassifier.tovList.length > 0
        ) {
          result.push(simplifiedClassifier);
        }

        // Process nested classifiers recursively
        if (classifier.row && classifier.row.length > 0) {
          classifier.row.forEach(processClassifier);
        }
      };

      // Process each classifier in the array
      classifiers.forEach(processClassifier);
      return result;
    };

    // Get all classifiers with simplified structure
    const simplifiedClassifiers = extractAllClassifiers(classifiers);

    const dbClassifiers = await prisma.classifier.findMany({
      select: {
        title: true,
        id: true,
        classgoods: {
          select: {
            good: {
              select: {
                id: true,
                regId: true,
              },
            },
          },
        },
      },
    });

    const transactions = [];

    for (const classifier of simplifiedClassifiers) {
      const dbcf = dbClassifiers.find((c) => c.id === classifier.id);

      if (!dbcf) {
        const goods = await prisma.good.findMany({
          where: {
            isDeleted: false,
            regId: { in: classifier.tovList.map((t) => t.RegId) },
          },
          select: { id: true },
        });

        if (goods.length > 0) {
          const newClassifier = prisma.classifier.create({
            data: {
              id: classifier.id,
              title: classifier.title,
              classgoods: {
                create: goods.map((g) => ({
                  goodId: g.id,
                })),
              },
            },
          });

          transactions.push(newClassifier);
        }
      } else {
        // Get all regIds from the classifier's tovList
        const classifierRegIds = classifier.tovList.map((t) => t.RegId);

        // Get all regIds from the database for this classifier
        const dbRegIds = dbcf.classgoods.map((cg) => cg.good.regId);

        // Find goods that are in the classifier but not in the database
        const missingRegIds = classifierRegIds.filter(
          (regId) => !dbRegIds.includes(regId)
        );

        if (missingRegIds.length > 0) {
          // Find the goods in the database that need to be added to this classifier
          const goodsToAdd = await prisma.good.findMany({
            where: { isDeleted: false, regId: { in: missingRegIds } },
            select: { id: true },
          });

          // Add the missing goods to the classifier
          if (goodsToAdd.length > 0) {
            const updateClassifier = prisma.classifier.update({
              where: { id: classifier.id },
              data: {
                classgoods: {
                  create: goodsToAdd.map((g) => ({
                    goodId: g.id,
                  })),
                },
              },
            });

            transactions.push(updateClassifier);
          }
        }

        // Find goods that are in the database but not in the classifier anymore
        const extraRegIds = dbRegIds.filter(
          (regId) => !classifierRegIds.includes(regId)
        );

        if (extraRegIds.length > 0) {
          // Get the IDs of goods that need to be removed
          const goodsToRemove = dbcf.classgoods
            .filter((cg) => extraRegIds.includes(cg.good.regId))
            .map((cg) => cg.good.id);

          // Remove the extra goods from the classifier
          if (goodsToRemove.length > 0) {
            const deleteClassgoods = prisma.classGood.deleteMany({
              where: {
                classId: classifier.id,
                goodId: { in: goodsToRemove },
              },
            });

            transactions.push(deleteClassgoods);
          }
        }
      }
    }

    const apiClassifierIds = simplifiedClassifiers.map((c) => c.id);

    const classifiersToRemove = dbClassifiers
      .filter((dbClassifier) => !apiClassifierIds.includes(dbClassifier.id))
      .map((c) => c.id);

    if (classifiersToRemove.length > 0) {
      // First delete the associated classgoods (due to foreign key constraints)
      const deleteClassgoods = prisma.classGood.deleteMany({
        where: {
          classId: { in: classifiersToRemove },
        },
      });

      // Then delete the classifiers
      const deleteClassifiers = prisma.classifier.deleteMany({
        where: {
          id: { in: classifiersToRemove },
        },
      });

      transactions.push(deleteClassgoods);
      transactions.push(deleteClassifiers);
    }

    const chunkSize = 100;

    let count = 0;

    for (let i = 0; i < transactions.length; i += chunkSize) {
      const chunk = transactions.slice(i, i + chunkSize);
      await prisma.$transaction(chunk);
      count += chunk.length;
    }

    return Response.json(count, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}
