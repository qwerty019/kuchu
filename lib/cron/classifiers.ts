"use server";

import {
  addClassGoods,
  createClassifier,
  deleteClassGoods,
  deleteClassifiers,
  getDbClassifiers,
  getGoods,
  getGoodsToAdd,
} from "./db";
import { Classifier, TovList } from "./definitions";
import { getClassifier } from "./farmbazis";

interface SimplifiedClassifier {
  title: string;
  id: number;
  tovList: TovList[];
}

export async function handleClassifiers() {
  try {
    const start = getCurrentTime();

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

    const dbClassifiers = await getDbClassifiers();

    if ("message" in dbClassifiers) {
      return { message: dbClassifiers.message };
    }

    const transactions = [];

    for (const classifier of simplifiedClassifiers) {
      const dbcf = dbClassifiers.find((c) => c.id === classifier.id);

      if (!dbcf) {
        const goods = await getGoods(classifier.tovList.map((t) => t.RegId));

        if ("message" in goods) {
          return { message: goods.message };
        }

        if (goods.length > 0) {
          const action = await createClassifier(
            classifier.id,
            classifier.title,
            goods.map((g) => g.id)
          );

          if ("message" in action) {
            return { message: action.message };
          }
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
          const goodsToAdd = await getGoodsToAdd(missingRegIds);

          if ("message" in goodsToAdd) {
            return { message: goodsToAdd.message };
          }

          // Add the missing goods to the classifier
          if (goodsToAdd.length > 0) {
            const action = await addClassGoods(
              classifier.id,
              goodsToAdd.map((g) => g.id)
            );

            if ("message" in action) {
              return { message: action.message };
            }
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
            const action = await deleteClassGoods(classifier.id, goodsToRemove);

            if ("message" in action) {
              return { message: action.message };
            }
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
      const action = await deleteClassifiers(classifiersToRemove);

      if ("message" in action) {
        return { message: action.message };
      }
    }

    const end = getCurrentTime();

    return { start, end };
  } catch (err) {
    console.log(err);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}
