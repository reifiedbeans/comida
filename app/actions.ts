"use server";

import { revalidatePath } from "next/cache";

import { ensureAuthorization } from "@/app/_utils/auth";
import { getUser, setUserMealRankings, setUserUnrankedMeals } from "@/app/_utils/dataAccess";
import { users } from "@/db/schema";

export async function setMealRankings(newRankings: typeof users.$inferSelect.rankedMeals) {
  const { user } = await ensureAuthorization();
  await setUserMealRankings(user.id, newRankings);
  revalidatePath("/");
}

export async function addUnrankedMeal(mealId: (typeof users.$inferSelect.unrankedMeals)[number]) {
  const { user } = await ensureAuthorization();
  const { unrankedMeals } = await getUser(user.id);
  await setUserUnrankedMeals(user.id, [...unrankedMeals, mealId]);
  revalidatePath("/");
}
