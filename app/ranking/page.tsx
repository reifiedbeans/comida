import _ from "lodash";
import Link from "next/link";

import CenteredContent from "@/app/_components/CenteredContent";
import { ensureAuthorization } from "@/app/_utils/auth";
import { getUserAndAllMeals } from "@/app/_utils/dataAccess";
import RankingInterface from "@/app/ranking/RankingInterface";

export default async function RankingPage() {
  const session = await ensureAuthorization();
  const { user, allMeals } = await getUserAndAllMeals({ userId: session.user.id });
  const seenMeals = [...user.rankedMeals, ...user.unrankedMeals];
  const newMeals = Array.from(allMeals.values()).filter(({ id }) => !seenMeals.includes(id));

  let referenceMeals = _.chain(user.rankedMeals)
    .map((id) => allMeals.get(id))
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
        newMeal={newMeals[0]}
        mealRanks={user.rankedMeals}
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
