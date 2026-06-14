"use server";

import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/db";
import { and, asc, eq, inArray } from "drizzle-orm";
import { slide, story, storyBranch } from "@/db/schema";
import { PageStory } from "./definitions";
import { StoryAdmin, StoryInEdit } from "./schema";

export async function fetchStories() {
  noStore();

  try {
    const stories = await db.query.story.findMany({
      where: eq(story.isDeleted, false),
      orderBy: [asc(story.position)],
      columns: { id: true, title: true, img: true },
    });

    return stories satisfies StoryAdmin[];
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении сториз.");
  }
}

export async function fetchPageStories() {
  noStore();

  const branch = cookies().get("branch")?.value;

  try {
    if (branch) {
      const storyBranches = await db.query.storyBranch.findMany({
        where: and(
          eq(storyBranch.isDeleted, false),
          eq(storyBranch.branchId, Number(branch))
        ),
        columns: { storyId: true },
      });

      const storyIds = storyBranches.map((branch) => branch.storyId);

      if (storyIds.length === 0) return [];

      const stories = await db.query.story.findMany({
        where: and(
          eq(story.isDeleted, false),
          eq(story.show, true),
          inArray(story.id, storyIds)
        ),
        orderBy: [asc(story.position)],
        with: {
          storyBranches: {
            where: eq(storyBranch.isDeleted, false),
            columns: { branchId: true },
          },
          slides: {
            where: eq(slide.isDeleted, false),
            columns: {
              id: true,
              title: true,
              img: true,
              subtitle: true,
              text: true,
              categoryId: true,
              link: true,
              button: true,
            },
            with: {
              category: {
                columns: {
                  id: true,
                  route: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      const transformed = stories.map((story) => {
        const { storyBranches, ...rest } = story;

        return {
          ...rest,
          storybranches: storyBranches,
        };
      });

      return transformed satisfies PageStory[];
    }

    const stories = await db.query.story.findMany({
      where: and(eq(story.isDeleted, false), eq(story.show, true)),
      orderBy: [asc(story.position)],
      with: {
        storyBranches: {
          where: eq(storyBranch.isDeleted, false),
          columns: { branchId: true },
        },
        slides: {
          where: eq(slide.isDeleted, false),
          columns: {
            id: true,
            title: true,
            img: true,
            subtitle: true,
            text: true,
            categoryId: true,
            link: true,
            button: true,
          },
          with: {
            category: {
              columns: {
                id: true,
                route: true,
                title: true,
              },
            },
          },
        },
      },
    });

    const transformed = stories.map((story) => {
      const { storyBranches, ...rest } = story;

      return {
        ...rest,
        storybranches: storyBranches,
      };
    });

    return transformed satisfies PageStory[];
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении сториз.");
  }
}

export async function fetchStory(id: number) {
  noStore();

  try {
    const found = await db.query.story.findFirst({
      where: and(eq(story.isDeleted, false), eq(story.id, id)),
      orderBy: [asc(story.position)],
      with: {
        storyBranches: {
          where: eq(storyBranch.isDeleted, false),
          columns: {
            branchId: true,
          },
        },
        slides: {
          where: eq(slide.isDeleted, false),
          columns: {
            id: true,
            title: true,
            img: true,
            subtitle: true,
            text: true,
            categoryId: true,
            link: true,
            button: true,
          },
        },
      },
    });

    if (!found) {
      throw new Error("Сториз не найден");
    }

    const transformed = {
      ...found,
      storybranches: found.storyBranches.map((x) => x.branchId),
    };

    return transformed satisfies StoryInEdit;
  } catch (error) {
    console.log(error);
    throw new Error(
      error instanceof Error ? error.message : "Ошибка при получении сториз."
    );
  }
}
