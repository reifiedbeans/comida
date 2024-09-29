import { ReactNode } from "react";

import { formatDate } from "@/app/_utils/date";
import type { Meal } from "@/db/schema";

interface Props {
  readonly meal: Meal;
  readonly actions?: ReactNode;
}

export default function MealCard({ meal, actions }: Props) {
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title fs-5">{meal.name}</h2>
        <h3 className="card-subtitle fs-6 text-body-secondary mb-3">{formatDate(meal.date)}</h3>
        {actions}
      </div>
    </div>
  );
}
