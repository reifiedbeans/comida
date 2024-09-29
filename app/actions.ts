"use server";

import { revalidatePath } from "next/cache";

import { ensureAuthorization } from "@/app/_utils/auth";
import {
  getUserRankings,
  upsertUserMealRankings,
  upsertUserUnrankedMeals,
} from "@/app/_utils/dataAccess";
import { Meal, UserRankings } from "@/db/schema";

export async function setMealRankings(
  seasonId: UserRankings["seasonId"],
  newRankings: UserRankings["rankedMeals"],
) {
  const { user } = await ensureAuthorization();
  await upsertUserMealRankings(user.id, seasonId, newRankings);
  revalidatePath("/");
}

export async function addUnrankedMeal(seasonId: UserRankings["seasonId"], mealId: Meal["id"]) {
  const { user } = await ensureAuthorization();
  const userRankings = await getUserRankings(user.id, seasonId);
  const existingUnrankedMeals = userRankings?.unrankedMeals ?? [];
  await upsertUserUnrankedMeals(user.id, seasonId, [...existingUnrankedMeals, mealId]);
  revalidatePath("/");
}
