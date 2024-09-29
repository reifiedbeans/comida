import { and, desc, eq } from "drizzle-orm";

import { mapOf } from "@/app/_utils/map";
import { db } from "@/db";
import { Meal, meals, seasons, UserRankings, userRankings } from "@/db/schema";

export async function getAllSeasons() {
  return mapOf(await db.query.seasons.findMany({ orderBy: desc(seasons.startDate) }));
}

export async function getUserRankings(
  userId: UserRankings["userId"],
  seasonId: UserRankings["seasonId"],
) {
  return db.query.userRankings.findFirst({
    where: and(eq(userRankings.userId, userId), eq(userRankings.seasonId, seasonId)),
  });
}

export async function getSeasonMeals(seasonId: Meal["seasonId"]) {
  return mapOf(await db.query.meals.findMany({ where: eq(meals.seasonId, seasonId) }));
}

export async function getUserRankingsAndMeals(
  userId: UserRankings["userId"],
  seasonId: UserRankings["seasonId"],
) {
  const [userRankings, seasonMeals] = await Promise.all([
    getUserRankings(userId, seasonId),
    getSeasonMeals(seasonId),
  ]);
  const rankedMeals = userRankings?.rankedMeals ?? [];
  const unrankedMeals = userRankings?.unrankedMeals ?? [];

  const seenMeals = [...rankedMeals, ...unrankedMeals];
  const newMeals = Array.from(seasonMeals.values()).filter(({ id }) => !seenMeals.includes(id));
  return { rankedMeals, unrankedMeals, newMeals, seasonMeals };
}

export async function upsertUserMealRankings(
  userId: UserRankings["userId"],
  seasonId: UserRankings["seasonId"],
  rankedMeals: UserRankings["rankedMeals"],
) {
  return db
    .insert(userRankings)
    .values({ userId, seasonId, rankedMeals, unrankedMeals: [] })
    .onConflictDoUpdate({
      target: [userRankings.userId, userRankings.seasonId],
      set: { rankedMeals },
    });
}

export async function upsertUserUnrankedMeals(
  userId: UserRankings["userId"],
  seasonId: UserRankings["seasonId"],
  unrankedMeals: UserRankings["unrankedMeals"],
) {
  return db
    .insert(userRankings)
    .values({ userId, seasonId, rankedMeals: [], unrankedMeals })
    .onConflictDoUpdate({
      target: [userRankings.userId, userRankings.seasonId],
      set: { unrankedMeals },
    });
}
