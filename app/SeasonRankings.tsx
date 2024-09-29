import CenteredContent from "@/app/_components/CenteredContent";
import RankedMealsTable from "@/app/_components/RankedMealsTable";
import RankMealsButton from "@/app/_components/RankMealsButton";
import type { Meal, Season, UserRankings } from "@/db/schema";

interface Props {
  readonly seasonId: Season["id"];
  readonly seasonMeals: Map<Meal["id"], Meal>;
  readonly rankedMeals: UserRankings["rankedMeals"];
  readonly newMeals: Meal[];
}

export default function SeasonRankings({ seasonId, seasonMeals, rankedMeals, newMeals }: Props) {
  if (rankedMeals.length === 0) {
    return (
      <CenteredContent>
        <div className="fs-1">😔</div>
        <div>No meals ranked yet</div>
        {newMeals.length > 1 && (
          <RankMealsButton seasonId={seasonId} numNewMeals={newMeals.length} />
        )}
      </CenteredContent>
    );
  }

  return (
    <div className="mt-3">
      {newMeals.length > 0 && <RankMealsButton seasonId={seasonId} numNewMeals={newMeals.length} />}
      <h2>Your ranked meals</h2>
      <RankedMealsTable seasonId={seasonId} mealRanks={rankedMeals} allMeals={seasonMeals} />
    </div>
  );
}
