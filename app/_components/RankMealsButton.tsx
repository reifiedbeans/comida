import Link from "next/link";

import { buildParamString, SearchParamKey } from "@/app/_utils/params";
import { Season } from "@/db/schema";

interface Props {
  readonly seasonId: Season["id"];
  readonly numNewMeals: number;
}

export default function RankMealsButton({ seasonId, numNewMeals }: Props) {
  return (
    <div className="d-grid d-sm-flex mb-4">
      <Link
        href={`/ranking?${buildParamString({ [SearchParamKey.SEASON]: seasonId })}`}
        className="btn btn-primary"
        role="button"
      >
        Rank {numNewMeals} new {numNewMeals == 1 ? "meal" : "meals"}
      </Link>
    </div>
  );
}
