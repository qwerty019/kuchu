export const dynamic = "force-dynamic";

import fs from "fs/promises";
import path from "path";

// get data from farmoperator json file
// initially xlsx file was converted to json
export async function GET() {
  try {
    let fileContents;

    try {
      const filePath = path.join(process.cwd(), "public", "data2.json");
      fileContents = await fs.readFile(filePath, "utf-8");
    } catch (error) {
      return Response.json({ message: "Файл JSON не найден" }, { status: 404 });
    }

    const data = JSON.parse(fileContents);

    let count = 0;

    for (const item of data) {
      if (item.URLimg) {
        try {
          const imgResponse = await fetch(item.URLimg);

          if (imgResponse.ok) {
            const imgBuffer = await imgResponse.arrayBuffer();
            const imgPath = path.join(
              process.cwd(),
              "public",
              "drugs",
              "images",
              `${item.ExtCode}.jpeg`
            );

            // Ensure directory exists
            await fs.mkdir(path.dirname(imgPath), { recursive: true });

            // Write image file
            await fs.writeFile(imgPath, new Uint8Array(imgBuffer));
          }
        } catch (error) {
          console.error(
            `Failed to fetch/save image for ${item.ExtCode}:`,
            error
          );
        }
      }

      if (item.URLDes) {
        try {
          const htmlResponse = await fetch(item.URLDes);

          if (htmlResponse.ok) {
            const htmlContent = await htmlResponse.text();
            const htmlPath = path.join(
              process.cwd(),
              "public",
              "drugs",
              "html",
              `${item.ExtCode}.html`
            );

            // Ensure directory exists
            await fs.mkdir(path.dirname(htmlPath), { recursive: true });

            // Write HTML file
            await fs.writeFile(htmlPath, htmlContent);
          }
        } catch (error) {
          console.error(
            `Failed to fetch/save HTML for ${item.ExtCode}:`,
            error
          );
        }
      }

      count++;
      console.log(count, data.length);
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}
