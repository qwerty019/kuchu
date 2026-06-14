export const dynamic = "force-dynamic";

import fs from "fs";
import path from "path";

const notFounds = [{ id: 10809, regId: 10809 }];

export async function GET() {
  try {
    const founds = [];

    // Get list of HTML files from public/drugs/html directory
    const htmlDir = path.join(process.cwd(), "public", "drugs", "html");
    let htmlFiles: number[] = [];

    try {
      // Read all files from the directory
      htmlFiles = fs
        .readdirSync(htmlDir)
        .filter((file) => file.endsWith(".html"))
        .map((file) => parseInt(path.basename(file, ".html")));
    } catch (error) {
      console.error("Error reading HTML directory:", error);
    }

    // Create a Set of notFound IDs for faster lookup
    const notFoundIds = new Set(notFounds.map((item) => item.regId));

    // Filter out HTML files that exist in notFounds
    const filteredIds = htmlFiles.filter((id) => notFoundIds.has(id));

    for (const id of filteredIds) {
      const htmlFile = fs.readFileSync(
        path.join(htmlDir, `${id}.html`),
        "utf8"
      );

      // Extract text content sections from HTML with preserved HTML tags
      const sections: Record<string, string> = {};

      // Use regex to find all section divs
      const sectionRegex =
        /<div class="ph\d+" id="ph\d+"><h3 class="desc" id="pb\d+">(.+?)<\/h3>(.+?)<\/div>/g;
      let match;

      while ((match = sectionRegex.exec(htmlFile)) !== null) {
        const title = match[1].trim();
        // Find the corresponding title value from titles array
        const titleObj = titles2.find((t) => t.label === title);
        if (!titleObj) console.log(title);
        // Preserve the HTML content
        const content = match[2];
        // Use the value from titles if found, otherwise use the original title
        sections[titleObj ? titleObj.value : title] = content;
      }

      // Create an object with the HTML content
      const htmlData = {
        id: notFounds.find((item) => item.regId === id)?.id,
        regId: id,
        ...sections,
      };

      // Add to found items
      founds.push(htmlData);
    }

    return Response.json(founds, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}

const titles2 = [
  { label: "Взаимодействие", value: "INTERACTIONS" },
  {
    label:
      "Влияние на способность к вождению автотранспорта и управлению механизмами",
    value: "DRIVING_EFFECT",
  },
  { label: "Действие", value: "ACTONORG" },
  { label: "Лекарственная форма", value: "FORM" },
  { label: "Описание", value: "DRUGFORMDESCR" },
  { label: "Особые указания", value: "SPECIALGUIDELINES" },
  { label: "Передозировка", value: "OVERDOSE" },
  { label: "Побочные действия", value: "SIDEACTIONS" },
  { label: "Показания к применению", value: "INDICATIONS" },
  {
    label: "Применение при беременности и кормлении грудью",
    value: "PREGNANCYUSE",
  },
  { label: "Применение у детей", value: "USECHILDREN" },
  {
    label: "Производитель и организация, принимающие претензии потребителей",
    value: "MANUFACTURER",
  },
  { label: "Противопоказания", value: "CONTRAINDICATIONS" },
  { label: "Состав", value: "COMPOSITION" },
  { label: "Способ применения и дозы", value: "USEMETHODANDDOSES" },
  { label: "Срок годности", value: "EXPIRATION" },
  { label: "Условия отпуска из аптек", value: "APTEKA_CONDITION" },
  { label: "Условия хранения", value: "STORAGE_CONDITION" },
  { label: "Фармакодинамика", value: "PHARMADYNAMIC" },
  { label: "Фармакокинетика", value: "PHARMAKINETIC" },
  { label: "Форма выпуска", value: "FORM" },
];
