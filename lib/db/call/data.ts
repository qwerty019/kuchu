import { db } from "@/db";
import { call } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { Call } from "./schema";

export async function getCall(callId: string, code: string) {
  noStore();

  try {
    const data = await db.query.call.findFirst({
      where: and(
        eq(call.isDeleted, false),
        eq(call.callId, callId),
        eq(call.code, code)
      ),
      columns: {
        id: true,
        callId: true,
        phone: true,
        code: true,
      },
    });

    if (!data) return null;

    return data satisfies Call;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить звонок.");
  }
}
