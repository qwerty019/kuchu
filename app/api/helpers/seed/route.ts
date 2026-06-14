export const dynamic = "force-dynamic";

import { seed } from "@/lib/db/seed";

// seed data from scratch (cities, branches, navtexts)
export async function GET() {
  try {
    const action = await seed();

    return Response.json(action, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: "Что-то пошло не так. Повторите еще." },
      { status: 500 }
    );
  }
}
