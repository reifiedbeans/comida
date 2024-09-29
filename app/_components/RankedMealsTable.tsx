"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";
import _ from "lodash";
import { useId, useOptimistic, useTransition } from "react";

import MealsTable from "@/app/_components/MealsTable";
import usePreventNavigation from "@/app/_hooks/usePreventNavigation";
import { setMealRankings } from "@/app/actions";
import type { Meal, Season, UserRankings } from "@/db/schema";

interface Props {
  readonly seasonId: Season["id"];
  readonly mealRanks: UserRankings["rankedMeals"];
  readonly allMeals: Map<Meal["id"], Meal>;
}

export default function RankedMealsTable({ seasonId, mealRanks, allMeals }: Props) {
  const dndContextId = useId();
  const [optimisticRanks, setOptimisticRanks] = useOptimistic(
    mealRanks,
    (_state, updatedRanks: typeof mealRanks) => updatedRanks,
  );

  const [isPendingMutation, startMutation] = useTransition();
  usePreventNavigation({ when: isPendingMutation });

  const meals = _.chain(optimisticRanks)
    .map((id) => allMeals.get(id))
    .compact()
    .value();

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = mealRanks.indexOf(active.id as string);
      const newIndex = mealRanks.indexOf(over.id as string);
      const newRanks = arrayMove(mealRanks, oldIndex, newIndex);
      startMutation(async () => {
        setOptimisticRanks(newRanks);
        await setMealRankings(seasonId, newRanks);
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  return (
    <DndContext
      id={dndContextId}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <MealsTable meals={meals} />
    </DndContext>
  );
}
