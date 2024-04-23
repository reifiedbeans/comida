"use client";

import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import RowDragHandle from "@/app/_components/RowDragHandle";
import Meal from "@/app/_types/Meal";
import { formatDate } from "@/app/_utils/date";

interface MealRowProps {
  readonly meal: Meal;
  readonly index: number;
}

function MealRow({ meal, index }: MealRowProps) {
  const { isDragging, setNodeRef, transform, transition } = useSortable({ id: meal.id });

  return (
    <tr
      key={meal.id}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: "relative",
      }}
    >
      <td>
        <RowDragHandle id={meal.id} />
        <span className="float-end">{index + 1}</span>
      </td>
      <td>
        {meal.name}
        <br />
        <small className="text-secondary-emphasis">{formatDate(meal.date)}</small>
      </td>
    </tr>
  );
}

interface MealsTableProps {
  readonly meals: Meal[];
}

export default function MealsTable({ meals }: MealsTableProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="text-end col-1" style={{ minWidth: "3.5rem" }}>
            Rank
          </th>
          <th>Dish</th>
        </tr>
      </thead>
      <tbody>
        <SortableContext items={meals} strategy={verticalListSortingStrategy}>
          {meals.map((meal, index) => (
            <MealRow key={meal.id} meal={meal} index={index} />
          ))}
        </SortableContext>
      </tbody>
    </table>
  );
}
