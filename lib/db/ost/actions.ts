import { db } from "@/db";
import { ost } from "@/db/schema";
import { getOstByDate } from "@/lib/farmbazis/data";
import { and, eq, sql } from "drizzle-orm";

export async function updateOsts(
  branch: { id: number; fbId: number },
  items: { id: number; regId: number }[]
) {
  const osts = await getOstByDate(branch.fbId.toString());

  for (const item of items) {
    const founds = osts.filter((o) => o.regId === item.regId);

    if (!founds.length) {
      await db
        .update(ost)
        .set({ isDeleted: true })
        .where(and(eq(ost.goodId, item.id), eq(ost.branchId, branch.id)));

      continue;
    }

    const ids = [];
    for (const f of founds) {
      const foundOst = await db.query.ost.findFirst({
        where: and(
          eq(ost.isDeleted, false),
          eq(ost.naklDataId, f.naklDataId),
          eq(ost.branchId, branch.id)
        ),
      });

      if (!foundOst) continue;

      await db
        .update(ost)
        .set({ uQntOst: f.uQntOst })
        .where(eq(ost.id, foundOst.id));

      ids.push(ost.id);
    }

    if (!ids.length) continue;

    await db
      .update(ost)
      .set({ isDeleted: true })
      .where(
        and(
          sql`${ost.id} NOT IN (${ids})`,
          eq(ost.goodId, item.id),
          eq(ost.branchId, branch.id)
        )
      );
  }
}
