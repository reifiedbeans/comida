import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const meals = pgTable("meals", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  date: date("date").notNull(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  rankedMeals: uuid("ranked_meals").array().notNull(),
  unrankedMeals: uuid("unranked_meals").array().notNull(),
});
