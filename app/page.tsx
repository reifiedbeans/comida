import Link from "next/link";

import CenteredContent from "@/app/_components/CenteredContent";
import { auth, signIn } from "@/app/_utils/auth";
import { getAllSeasons, getUserRankingsAndMeals } from "@/app/_utils/dataAccess";
import { BadRequestError } from "@/app/_utils/errors";
import { PageProps } from "@/app/_utils/page";
import { buildParamString, getParamValue, SearchParamKey } from "@/app/_utils/params";
import SeasonRankings from "@/app/SeasonRankings";

export default async function HomePage(props: PageProps) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <CenteredContent>
        <h2>Welcome</h2>
        <form
          action={async () => {
            "use server";
            await signIn("passage");
          }}
        >
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </form>
      </CenteredContent>
    );
  }

  const seasons = await getAllSeasons();

  const defaultSeasonId = Array.from(seasons.values())[0].id;
  const currentSeasonId = getParamValue(SearchParamKey.SEASON, searchParams) ?? defaultSeasonId;
  const currentSeason = seasons.get(currentSeasonId);
  if (!currentSeason) {
    throw new BadRequestError(`Season with ID ${currentSeasonId} does not exist`);
  }

  const userDataAndMeals = await getUserRankingsAndMeals(userId, currentSeasonId);

  return (
    <div className="h-100 d-flex flex-column">
      <ul className="nav nav-tabs">
        {Array.from(seasons.values()).map((season) => {
          const isCurrentSeason = currentSeasonId === season.id;
          return (
            <li className="nav-item" key={season.id}>
              <Link
                href={`/?${buildParamString({ [SearchParamKey.SEASON]: season.id })}`}
                className={isCurrentSeason ? "nav-link active" : "nav-link"}
                {...(isCurrentSeason && { "aria-current": "page" })}
              >
                {season.name}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex-grow-1">
        <SeasonRankings seasonId={currentSeasonId} {...userDataAndMeals} />
      </div>
    </div>
  );
}
