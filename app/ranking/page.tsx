import _ from "lodash";
import Link from "next/link";

import CenteredContent from "@/app/_components/CenteredContent";
import { ensureAuthorization } from "@/app/_utils/auth";
import { getUserRankingsAndMeals } from "@/app/_utils/dataAccess";
import { BadRequestError } from "@/app/_utils/errors";
import { PageProps } from "@/app/_utils/page";
import { getParamValue, SearchParamKey } from "@/app/_utils/params";
import RankingInterface from "@/app/ranking/RankingInterface";

export default async function RankingPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const session = await ensureAuthorization();
  const userId = session.user.id;
  const seasonId = getParamValue(SearchParamKey.SEASON, searchParams);

  if (!seasonId) {
    throw new BadRequestError(
      "Season param was not passed",
      `Search param '${SearchParamKey.SEASON.valueOf()}' is required`,
    );
  }

  const userDataAndMeals = await getUserRankingsAndMeals(userId, seasonId);
  const { newMeals, rankedMeals, seasonMeals } = userDataAndMeals;

  let referenceMeals = _.chain(rankedMeals)
    .map((id) => seasonMeals.get(id))
    .compact()
    .value();
  if (referenceMeals.length === 0) {
    referenceMeals = newMeals.length > 1 ? [newMeals[1]] : [];
  }

  if (newMeals.length === 0 || referenceMeals.length === 0) {
    return (
      <CenteredContent>
        <div className="fs-1">🤩</div>
        <div>No new meals to rank</div>
        <Link href="/" className="btn btn-primary" role="button">
          See your rankings
        </Link>
      </CenteredContent>
    );
  }
  return (
    <>
      <RankingInterface
        seasonId={seasonId}
        newMeal={newMeals[0]}
        mealRanks={rankedMeals}
        referenceMeals={referenceMeals}
      />
      <div className="mt-4">
        <Link
          href="/"
          className="ms-2 link-underline link-offset-3 link-underline-opacity-0 link-underline-opacity-100-hover"
        >
          ← Back to rankings
        </Link>
      </div>
    </>
  );
}
