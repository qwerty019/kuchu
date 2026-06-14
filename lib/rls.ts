import { load } from "cheerio";

function normalizeWhitespace(text: string) {
  return text
    .replace(/\u00A0/g, " ") // &nbsp; -> space
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function absUrl(src: string | undefined | null, baseUrl?: string) {
  if (!src) return "";
  if (src.startsWith("//")) return "https:" + src;
  try {
    return baseUrl ? new URL(src, baseUrl).toString() : src;
  } catch {
    return src;
  }
}

export function parseRlsHtml(html: string, baseUrl?: string): RlsParsed {
  const $ = load(html);

  // Title
  const title = $("h1.item_name").first().text().trim() || null;

  // Company
  const $company = $("p.customer a").first();
  const companyName = $company.text().trim() || null;
  const companyUrl = $company.length
    ? absUrl($company.attr("href"), baseUrl)
    : null;

  // Dosage forms (the prep_lf lines)
  const dosage_forms = $(".prep_lf")
    .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get();

  // Images (deduped, protocol-relative handled)
  const images = Array.from(
    new Set(
      $("img")
        .map((_, el) => absUrl($(el).attr("src") || "", baseUrl))
        .get()
        .filter(Boolean)
    )
  );

  // Helper to convert a section content node to readable text (preserve paragraph breaks)
  const nodeToText = (el: any) => {
    const $el = $(el).clone();

    // Insert line breaks for <br> and end of <p>
    $el.find("br").replaceWith("\n");
    $el.find("p").each((_, p) => {
      const $p = $(p);
      const t = $p.text();
      $p.replaceWith(t + "\n");
    });

    // Get text and normalize
    return normalizeWhitespace($el.text());
  };

  // Sections are <h3.section_header> + next sibling <div.section_content>
  const sections = $("h3.section_header")
    .map((_, h) => {
      let sectionTitle = $(h).text().replace(/\s+/g, " ").trim();
      // Find the *nearest following* .section_content
      let next = $(h).next();
      while (
        next.length &&
        !(
          next.is("div") &&
          (next.attr("class") || "").split(/\s+/).includes("section_content")
        )
      ) {
        next = next.next();
      }
      const text = next.length ? nodeToText(next.get(0)!) : "";

      if (sectionTitle.includes("Условия хранения")) {
        sectionTitle = "Условия хранения";
      }

      if (sectionTitle.includes("Срок годности")) {
        sectionTitle = "Срок годности";
      }

      return { section: sectionTitle, text };
    })
    .get();

  // Build a flat, indexable description
  const parts: string[] = [];
  if (title) parts.push(title);
  if (companyName) parts.push(`Производитель: ${companyName}`);
  if (dosage_forms.length)
    parts.push(`Лекарственные формы: ${dosage_forms.join("; ")}`);
  for (const sec of sections) {
    if (sec.section && sec.text) parts.push(`${sec.section}:\n${sec.text}`);
  }
  const description_plaintext = parts.join("\n\n").trim();

  return {
    title,
    company: { name: companyName, url: companyUrl },
    dosage_forms,
    sections: sections.filter((x) => x.text !== ""),
    images: images.filter(
      (x) => x !== "https://app.rlsnet.ru/api/storage/mail_template/png/3_1"
    ),
    description_plaintext,
  };
}

export type Inventory = {
  prep_full: string;
  packing_full: string;
  firms: string;
  desc_id: number | null;
};

export type RlsParsed = {
  title: string | null;
  company: { name: string | null; url: string | null };
  dosage_forms: string[];
  sections: { section: string; text: string }[];
  images: string[];
  description_plaintext: string;
};
