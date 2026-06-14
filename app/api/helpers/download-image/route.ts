export const dynamic = "force-dynamic";

import fs from "fs";
import path from "path";
import sharp from "sharp";

const data = [
  {
    regId: 27906,
    url: "https://app.rlsnet.ru/api/storage/packing/gif/6897_a.jpg",
  },
];

export async function GET() {
  try {
    // uncomment this
    // const imageDir = path.join(process.cwd(), "public", "images", "product");
    const imageDir = "public/images/product";

    let count = 0;

    for (const item of data) {
      if (!item.url || !item.url.includes("https://")) {
        continue;
      }

      try {
        const response = await fetch(item.url);
        if (!response.ok) {
          console.log(
            `Failed to download image for ${item.regId}: ${response.status}`
          );
          throw new Error("Failed to download image");
        }

        // Get the image data as buffer
        const imageBuffer = await response.arrayBuffer();

        // Determine image format from URL or default to png
        const imageFormat = item.url.split(".").pop()?.toLowerCase();

        // Create a filename using the regId
        const imageFilename = `${item.regId}.png`;
        const imagePath = path.join(imageDir, imageFilename);

        // Convert image to PNG if it's not already PNG
        if (imageFormat === "png") {
          // Write the downloaded image to file
          fs.writeFileSync(imagePath, new Uint8Array(imageBuffer));
        } else {
          // Convert to PNG using sharp
          await sharp(Buffer.from(imageBuffer))
            .toFormat("png")
            .toFile(imagePath);
        }

        count++;
        console.log(count, data.length);
      } catch (error) {
        console.log(error);
        throw new Error("Failed to download image");
      }
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
