import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FieldValues } from "react-hook-form";
import { Address } from "./db/address/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const filterChangedFormFields = <T extends FieldValues>(
  allFields: T,
  dirtyFields: Partial<Record<keyof T, boolean>>
): Partial<T> => {
  const changedFieldValues = Object.keys(dirtyFields).reduce(
    (acc, currentField) => {
      return {
        ...acc,
        [currentField]: allFields[currentField],
      };
    },
    {} as Partial<T>
  );

  return changedFieldValues;
};

export function random5() {
  return Math.floor(10000 + Math.random() * 90000);
}

export function getWordWithNumbers(form: string) {
  const arr = form.split(" ");
  const regex = /\d+/; // This regex checks for any digit
  const match = arr.filter((word) => regex.test(word));
  if (match.length === 0) return form;
  return match[0];
}

export function getOrderStatus(order: {
  version: number;
  status: string | null;
  payments: { status: string | null }[];
}) {
  if (order.version === 2) {
    return order.status;
  }

  if (order.payments.length > 0) {
    const pending = order.payments.every((p) => p.status === "waiting");
    if (pending) return "Ожидает оплаты";

    const canceled = order.payments.every((p) => p.status === "canceled");
    if (canceled) return "Отменен";

    const refunded = order.payments.every((p) => p.status === "refunded");
    if (refunded) return "Возврат";
  }

  if (order.status === "1") return "Отменен";
  if (order.status === "2") return "Выдан";
  if (order.status === "3") return "Доставлен в аптеку";
  if (order.status === "4") return "Заказан";
  if (order.status === "5") return "Принят";
  if (order.status === "6") return "Собран";

  return "Создан";
}

export function showAddInfo(address: Address) {
  const { entrance, floor, apartment, comment } = address;

  if (!entrance && !floor && !apartment && !comment) {
    return null;
  }

  const info = [];

  if (entrance) info.push(`П: ${entrance}`);
  if (floor) info.push(`Э: ${floor}`);
  if (apartment) info.push(`К: ${apartment}`);
  if (comment) info.push(`Км: ${comment}`);

  return info.join(", ");
}

export function generateEAN13(): string {
  // Generate 12 random digits
  let ean12 = "";
  for (let i = 0; i < 12; i++) {
    ean12 += Math.floor(Math.random() * 10).toString();
  }

  // Calculate the check digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(ean12.charAt(i), 10);
    if (i % 2 === 0) {
      sum += digit;
    } else {
      sum += digit * 3;
    }
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  // Return the complete EAN-13 string
  return ean12 + checkDigit.toString();
}

export function calculateDiscount(
  sum: number,
  percent: number,
  accumulation: number
): number {
  // Calculate the potential discount
  const potential = sum * (percent / 100);

  // Determine the final discount based on accumulation
  const final = potential <= accumulation ? potential : accumulation;

  // Return the final discount amount
  return parseFloat(final.toFixed(2));
}

export function getHourAndMinuteInTimezone(
  timezone: string,
  date: string = "today"
) {
  const now = new Date();

  if (date === "tomorrow") now.setDate(now.getDate() + 1);

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    weekday: "short", // Add weekday to the formatter
    timeZone: timezone,
  });

  const formatted = formatter.formatToParts(now);
  const formattedHour = formatted.find((part) => part.type === "hour");
  const formattedMinute = formatted.find((part) => part.type === "minute");
  const formattedWeekday = formatted.find((part) => part.type === "weekday");

  if (!formattedHour || !formattedMinute || !formattedWeekday) {
    return { hour: 0, minute: 0, day: "Unknown" };
  }

  const hour = parseInt(formattedHour.value, 10);
  const minute = parseInt(formattedMinute.value, 10);
  const day = formattedWeekday.value;

  return { hour, minute, day };
}

export function editSlots(
  date: string,
  slots: { label: string; start: number; end: number; disabled: boolean }[],
  hour: number,
  minute: number
) {
  const dt = 0; // delivery time
  const first = slots[0];
  const last = slots[slots.length - 1];

  if (date === "tomorrow") return slots;

  if (last.end <= hour || (last.end - 1 === hour && minute > dt)) {
    return slots.map((slot) => ({ ...slot, disabled: true }));
  }

  if (hour <= first.start) return slots;

  const newSlots = [];

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (slot.start < hour && hour === slot.end - 1 && minute > dt) {
      newSlots.push({ ...slot, disabled: true });
      continue;
    }

    if (slot.start <= hour && hour < slot.end) {
      newSlots.push({ ...slot, disabled: false });
      continue;
    }

    if (slot.start > hour) {
      newSlots.push({ ...slot, disabled: false });
      continue;
    }

    newSlots.push({ ...slot, disabled: true });
  }

  return newSlots;
}

// Helper function to get the first non-disabled slot
export function getFirstAvailableSlot(
  slots: { label: string; start: number; end: number; disabled: boolean }[]
) {
  for (const slot of slots) {
    if (!slot.disabled) return slot.label;
  }
  return null; // Fallback to the first slot if all are disabled
}

export function contentToText(content: string) {
  let text = content;

  text = text.replace(/<[^>]*>/g, "");

  // Replace common HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt/g, "<")
    .replace(/&lt;/g, "<")
    .replace(/&gt/g, ">")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8209;/g, "-")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/&#8722;/g, "-")
    .replace(/&#8239;/g, " ")
    .replace(/&#945/g, "α")
    .replace(/&#945;/g, "α")
    .replace(/&times;/g, "×")
    .replace(/&oacute;/g, "ó")
    .replace(/&alpha;/g, "α")
    .replace(/&deg;/g, "°")
    .replace(/&beta;/g, "β")
    .replace(/&#x00F3;/g, "ó")
    .replace(/&#903;/g, "·")
    .replace(/&frac12;/g, "½")
    .replace(/&gamma;/g, "γ")
    .replace(/&#946;/g, "β")
    .replace(/&middot;/g, "·")
    .replace(/&#593;/g, "ə")
    .replace(/&plusmn;/g, "±")
    .replace(/&mu;/g, "μ")
    .replace(/&laquo/g, "«")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo/g, "»")
    .replace(/&raquo;/g, "»")
    .replace(/&ge/g, "≥")
    .replace(/&ge;/g, "≥")
    .replace(/&shy;/g, "")
    .replace(/&frac14;/g, "¼")
    .replace(/&frac13;/g, "⅓")
    .replace(/&#8595;/g, "↓")
    .replace(/&#8593;/g, "↑")
    .replace(/&le;/g, "≤")
    .replace(/&#8593;/g, "↑")
    .replace(/&#243;/g, "ó")
    .replace(/&#8805;/g, "≥")
    .replace(/&#947;/g, "γ")
    .replace(/&#8776;/g, "≈")
    .replace(/&le;/g, "≤")
    .replace(/&#956;/g, "μ")
    .replace(/&#954;/g, "κ")
    .replace(/&#948;/g, "δ")
    .replace(/&#963;/g, "σ")
    .replace(/&#215;/g, "×")
    .replace(/&#160;/g, " ")
    .replace(/&#x2014;/g, "—")
    .replace(/&#8804;/g, "≤")
    .replace(/&#x00D7;/g, "×")
    .replace(/&#x2212;/g, "−")
    .replace(/&#8734;/g, "∞")
    .replace(/&#x03B4;/g, "δ")
    .replace(/&#x03B1;/g, "α")
    .replace(/&#189;/g, "½")
    .replace(/&#967;/g, "χ")
    .replace(/&#x03B2;/g, "β")
    .replace(/&#8596;/g, "↔")
    .replace(/&#916;/g, "Δ")
    .replace(/&#x2015;/g, "―")
    .replace(/&#228;/g, "ä")
    .replace(/&#964;/g, "τ")
    .replace(/&#252;/g, "ü")
    .replace(/&#216;/g, "Ø");

  // Remove carriage returns, line breaks, and normalize spaces
  text = text
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

export const deliveryStatuses = [
  { value: "Собираем заказ", label: "Собираем заказ" },
  { value: "Передали курьеру", label: "Передали курьеру" },
  { value: "Доставили до вас", label: "Доставили до вас" },
  { value: "Отменен", label: "Отменен" },
];

export const pickupStatuses = [
  { value: "Собираем заказ", label: "Собираем заказ" },
  { value: "Готово к выдаче", label: "Готово к выдаче" },
  { value: "Отменен", label: "Отменен" },
];

export function getTitle(
  good: { title: string | null; drug: string },
  shortText?: boolean
) {
  if (good.title) {
    if (shortText && good.title.length > 30) {
      return good.title.slice(0, 30) + "...";
    }

    return good.title;
  }

  if (shortText && good.drug.length > 30) {
    return good.drug.slice(0, 30) + "...";
  }

  return good.drug;
}

export function getSubtitle(
  good: { subtitle: string | null; form: string },
  shortText?: boolean
) {
  if (good.subtitle) {
    if (shortText && good.subtitle.length > 10) {
      return good.subtitle.slice(0, 10) + "...";
    }

    return good.subtitle;
  }

  if (shortText && good.form.length > 10) {
    return good.form.slice(0, 10) + "...";
  }

  return good.form;
}

export const createTimeSlots = (startHour: number, minute: number) => {
  const slots = [];
  const MIN_HOUR = 8;
  const MAX_HOUR = 23;

  // 1. Determine the actual starting point
  let currentHour = startHour;
  if (minute > 15) currentHour++;

  // 2. Generate slots for the next 24-48 hours, but only keep those in range
  for (let i = 0; i < 48; i++) {
    // Look ahead 48 hours to find enough valid slots
    const checkTime = new Date();
    checkTime.setHours(currentHour + i, 0, 0, 0);

    const hour = checkTime.getHours();
    const isTomorrow = checkTime.getDate() !== new Date().getDate();

    // 3. Only add if within 08:00 and 23:00
    if (hour >= MIN_HOUR && hour < MAX_HOUR) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedNextHour = (hour + 1).toString().padStart(2, "0");

      slots.push({
        label: `${formattedHour}:00 - ${formattedNextHour}:00`,
        value: `${formattedHour}:00 - ${formattedNextHour}:00`,
        desc: isTomorrow ? "Завтра" : undefined,
      });
    }

    // Stop once we have 24 valid slots or have looked far enough ahead
    if (slots.length >= 24) break;
  }

  return slots;
};

export function getPrice(
  inputTokens: string,
  outputTokens: string,
  model: string
) {
  const totalTokens = Number(inputTokens) + Number(outputTokens);

  const foundModel = models.find((m) => m.name === model);
  if (!foundModel) {
    throw new Error("Модель не найдена.");
  }

  const price = (foundModel.syncPrice / foundModel.tokens) * totalTokens;

  return Number(price.toFixed(3));
}

const models = [
  { name: "yandexgpt-lite", syncPrice: 0.2, asyncPrice: 0.1, tokens: 1000 },
  { name: "yandexgpt-5.0-pro", syncPrice: 1.2, asyncPrice: 0.6, tokens: 1000 },
];

/**
 * Simulates searching a vector database for relevant documents based on a query embedding.
 * In a real application, this would involve a network request to a specialized vector database.
 * @param queryVector - The embedding of the user's new message.
 * @param knowledgeBase - An array of all knowledge documents (simulated DB).
 * @param topK - The number of top relevant documents to retrieve.
 * @returns An array of strings containing the content of the topK most relevant documents.
 */
export function simulateVectorDbSearch(
  queryVector: number[],
  knowledges: { content: string; embeddings: number[] }[],
  topK: number = 3
): string[] {
  if (!queryVector || queryVector.length === 0) {
    console.warn("Query vector is empty, returning no knowledge base results.");
    return [];
  }

  if (!knowledges || knowledges.length === 0) {
    console.warn(
      "Knowledge base is empty, returning no knowledge base results."
    );
    return [];
  }

  const scoredDocuments = knowledges
    .map((doc) => ({
      doc,
      similarity: cosineSimilarity(queryVector, doc.embeddings),
    }))
    .filter((item) => !isNaN(item.similarity)) // Filter out any NaN similarities
    .sort((a, b) => b.similarity - a.similarity); // Sort by similarity descending

  // Return the content of the top K documents
  return scoredDocuments.slice(0, topK).map((item) => item.doc.content);
}

/**
 * Calculates the cosine similarity between two vectors.
 * Cosine similarity measures the cosine of the angle between two non-zero vectors.
 * A value of 1 means the vectors are identical, 0 means orthogonal, -1 means diametrically opposite.
 * @param vecA - The first vector.
 * @param vecB - The second vector.
 * @returns The cosine similarity between the two vectors.
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error(
      "Vectors must have the same dimension for cosine similarity calculation."
    );
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0; // Avoid division by zero if a vector is zero
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

export function formatDateToDDMMYY(isoDate: Date | string | null) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}.${month}.${year}`;
}

export function formatDateToHHMM(isoDate: Date | string | null) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getFullName(user: {
  surname: string | null;
  name: string | null;
  patronymic: string | null;
}) {
  return [user.surname, user.name, user.patronymic].filter(Boolean).join(" ");
}

export function isWithinDateRange({
  start,
  end,
  timezoneOffset = 9,
}: {
  start: Date;
  end: Date;
  timezoneOffset?: number; // in hours, e.g., 9 for +09:00
}): boolean {
  try {
    const now = new Date();
    // Convert to UTC+TimezoneOffset
    const offsetMs = timezoneOffset * 60 * 60 * 1000;
    const localTime = new Date(now.getTime() + offsetMs);

    return localTime >= start && localTime <= end;
  } catch {
    return false;
  }
}
