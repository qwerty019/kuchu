export const dynamic = "force-dynamic";

import fs from "fs";
import path from "path";

const goods = [
  {
    id: 10809,
    drug: "Ренни",
    form: "таб. жев. №24 (апельсин)",
    fabr: "Delpharm Giallard/Франция",
    mnn: "Кальция карбонат+Магния карбонат",
    ean: "3534510000566,425036950710,4250369507108,4250369505845",
    desc_id: 114054,
    prep_short: "РЕННИ табл. жев. 680 мг+80 мг  апельсин.",
    firms: "Делфарм Гайярд (Франция)",
    start: "2025-04-24T14:22:56.402Z",
    end: "2025-04-24T14:22:59.826Z",
  },
];

export async function GET() {
  try {
    const founds: {
      id: string;
      img: string | null;
    }[] = [];

    let total = goods.length;

    // Process in batches of 3
    const batchSize = 3;

    // Process all goods in batches
    for (let i = 0; i < goods.length; i += batchSize) {
      const batch = goods.slice(i, i + batchSize);

      const batchPromises = batch.map(async (good, batchIndex) => {
        const count = i + batchIndex + 1;

        try {
          const data = await getDescFromAurora({
            desc_id: good.desc_id,
          });

          const image = await getImageFromAurora({
            desc_id: good.desc_id,
          });

          if (data.length === 0) {
            console.log(`${count}/${total} - Нет данных`);
            return null;
          }

          const desc = data[0];
          console.log(`${count}/${total} - Найден товар`);

          if (image) {
            // Save image to public/rls/images directory
            const imageDir = path.join(
              process.cwd(),
              "public",
              "rls-aurora",
              "images"
            );

            if (!fs.existsSync(imageDir)) {
              fs.mkdirSync(imageDir, { recursive: true });
            }

            // Download the image from the URL
            try {
              const response = await fetch(image);
              if (!response.ok) {
                console.log(
                  `Failed to download image for ${good.id}: ${response.status}`
                );
                throw new Error("Failed to download image");
              }

              // Get the image data as buffer
              const imageBuffer = await response.arrayBuffer();

              // Determine image format from URL or default to png
              const imageFormat =
                image.split(".").pop()?.toLowerCase() || "png";

              // Create a filename using the good.id
              const imageFilename = `${good.id}.${imageFormat}`;
              const imagePath = path.join(imageDir, imageFilename);

              // Write the downloaded image to file
              fs.writeFileSync(imagePath, new Uint8Array(imageBuffer));
            } catch (error) {
              console.log(error);
            }
          }

          return {
            id: good.id,
            img: image,
            ...desc,
          };
        } catch (error) {
          console.log(error);
          console.log(`${count}/${total} - Ошибка при получении данных`);
          return null;
        }
      });

      // Wait for the current batch to complete before starting the next batch
      const batchResults = await Promise.all(batchPromises);

      // Add valid results to founds array
      batchResults.forEach((result) => {
        if (result) {
          founds.push(result);
        }
      });
    }

    const outputDir = path.join(process.cwd(), "public", "rls-aurora");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputPath = path.join(outputDir, `founds-${timestamp}.json`);

    fs.writeFileSync(outputPath, JSON.stringify(founds, null, 2), "utf8");
    console.log(`Saved founds to ${outputPath}`);

    return Response.json(founds, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}

async function getDescFromAurora({ desc_id }: { desc_id: number }) {
  const token = Buffer.from(
    `${process.env.RLS_USER}:${process.env.RLS_PASSWORD}`
  ).toString("base64");

  const response = await fetch(
    `https://rls-aurora.ru/api/library_description?desc_id=${desc_id}`,
    { headers: { Authorization: `Basic ${token}` } }
  );

  if (!response.ok) {
    throw new Error("Что-то пошло не так. Повторите еще.");
  }

  const data = await response.json();

  return data;
}

async function getImageFromAurora({ desc_id }: { desc_id: number }) {
  const token = Buffer.from(
    `${process.env.RLS_USER}:${process.env.RLS_PASSWORD}`
  ).toString("base64");

  const response = await fetch(
    `https://rls-aurora.ru/api/library_solid_description?desc_id=${desc_id}&pics_on=1`,
    { headers: { Authorization: `Basic ${token}` } }
  );

  if (!response.ok) {
    throw new Error("Что-то пошло не так. Повторите еще.");
  }

  const data = await response.text();

  // Extract the first image URL matching the pattern
  const regex =
    /https:\/\/rls-aurora\.ru\/images\/arls\/[a-zA-Z0-9]+\.[a-zA-Z]+/;
  const match = data.match(regex);

  return match ? match[0] : null;
}
