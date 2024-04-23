"use client";

import { useEffect, useState, useTransition } from "react";

import FullPageOverlayLoader from "@/app/_components/FullPageOverlayLoader";
import MealCard from "@/app/_components/MealCard";
import MealRankingActions from "@/app/_components/MealRankingActions";
import usePreventNavigation from "@/app/_hooks/usePreventNavigation";
import Meal from "@/app/_types/Meal";
import { addUnrankedMeal, setMealRankings } from "@/app/actions";

interface Props {
  readonly mealRanks: Meal["id"][];
  readonly newMeal: Meal;
  readonly referenceMeals: Meal[];
}

function getMidpoint({ start, end }: { start: number; end: number }) {
  return start + Math.floor((end - start) / 2);
}

export default function RankingInterface({ mealRanks, newMeal, referenceMeals }: Props) {
  const initialReferenceWindow = { start: 0, end: referenceMeals.length - 1 };
  const [referenceWindow, setReferenceWindow] = useState(initialReferenceWindow);

  const [isDirty, setIsDirty] = useState(false);
  const [isPendingMutation, startMutation] = useTransition();
  usePreventNavigation({ when: isDirty || isPendingMutation });

  useEffect(() => {
    setReferenceWindow({ start: 0, end: referenceMeals.length - 1 });
  }, [referenceMeals]);

  const referenceMealIndex = getMidpoint(referenceWindow);
  const referenceMeal = referenceMeals[referenceMealIndex];

  function handleSelection(selection: Meal) {
    setIsDirty(true);

    const newReferenceWindow =
      selection === newMeal
        ? { start: referenceWindow.start, end: referenceMealIndex - 1 }
        : { start: referenceMealIndex + 1, end: referenceWindow.end };

    if (newReferenceWindow.start > newReferenceWindow.end) {
      const rankingReplacement =
        selection === newMeal ? [newMeal.id, referenceMeal.id] : [referenceMeal.id, newMeal.id];

      const newRankings = mealRanks.toSpliced(referenceMealIndex, 1, ...rankingReplacement);
      startMutation(async () => {
        await setMealRankings(newRankings);
        setIsDirty(false);
      });
    } else {
      setReferenceWindow(newReferenceWindow);
    }
  }

  function handleHide(meal: Meal) {
    startMutation(async () => {
      await addUnrankedMeal(meal.id);
    });
  }

  return (
    <>
      {isPendingMutation && <FullPageOverlayLoader />}
      <h2 className="mb-3">Which did you prefer?</h2>
      <div className="container-fluid">
        <div className="row gy-3">
          <div className="col-md-6">
            <MealCard
              meal={newMeal}
              actions={
                <MealRankingActions meal={newMeal} onSelect={handleSelection} onHide={handleHide} />
              }
            />
          </div>
          <div className="col-md-6">
            <MealCard
              meal={referenceMeal}
              actions={
                <MealRankingActions
                  meal={referenceMeal}
                  onSelect={handleSelection}
                  // Only show hide button for reference meal if it is new
                  onHide={mealRanks.length === 0 ? handleHide : undefined}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
