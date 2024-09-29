import { date, pgTable, primaryKey, text, uuid } from "drizzle-orm/pg-core";

export const seasons = pgTable("seasons", {
  id: text("id").primaryKey(),
  startDate: date("start_date").notNull(),
  name: text("name").notNull(),
});

export const meals = pgTable("meals", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  date: date("date").notNull(),
  seasonId: text("season_id")
    .references(() => seasons.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
});

export const userRankings = pgTable(
  "user_rankings",
  {
    userId: text("user_id").notNull(),
    seasonId: text("season_id")
      .references(() => seasons.id, { onDelete: "cascade", onUpdate: "cascade" })
      .notNull(),
    rankedMeals: uuid("ranked_meals").array().notNull(),
    unrankedMeals: uuid("unranked_meals").array().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.seasonId] }),
  }),
);

export type Meal = typeof meals.$inferSelect;
export type Season = typeof seasons.$inferSelect;
export type UserRankings = typeof userRankings.$inferSelect;
