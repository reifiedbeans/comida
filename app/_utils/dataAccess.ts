import { eq } from "drizzle-orm";
import _ from "lodash";

import { db } from "@/db";
import { users } from "@/db/schema";

export async function getUser(id: string) {
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (user === undefined) {
    throw new Error(`User with id ${id} does not exist`);
  }

  return user;
}

export async function getAllMeals() {
  return db.query.meals.findMany();
}

export async function getUserAndAllMeals({ userId }: { userId: string }) {
  const userData = getUser(userId);
  const mealsData = getAllMeals();
  const [user, allMealsList] = await Promise.all([userData, mealsData]);
  const allMeals = new Map<(typeof allMealsList)[number]["id"], (typeof allMealsList)[number]>();
  allMealsList.forEach((meal) => allMeals.set(meal.id, meal));
  return { user, allMeals };
}

export async function setUserMealRankings(
  userId: string,
  newRankings: typeof users.$inferSelect.rankedMeals,
) {
  return db.update(users).set({ rankedMeals: newRankings }).where(eq(users.id, userId));
}

export async function setUserUnrankedMeals(
  userId: string,
  newUnrankedMeals: typeof users.$inferSelect.unrankedMeals,
) {
  return db.update(users).set({ unrankedMeals: newUnrankedMeals }).where(eq(users.id, userId));
}

export async function getOverallRanks() {
  const users = await db.query.users.findMany();
  const userMealScores = new Map<string, number[]>();

  for (const { rankedMeals } of users) {
    for (const meal of rankedMeals) {
      const currentScores = userMealScores.get(meal) ?? [];
      const rank = rankedMeals.indexOf(meal);
      if (rank >= 0) {
        const score = 1 - rank / rankedMeals.length;
        userMealScores.set(meal, [...currentScores, score]);
      }
    }
  }

  const overallScores = Array.from(userMealScores.entries()).map(([meal, scores]) => {
    return { meal, score: _.mean(scores) };
  });

  return overallScores.toSorted(({ score: a }, { score: b }) => b - a).map(({ meal }) => meal);
}
