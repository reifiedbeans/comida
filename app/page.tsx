import CenteredContent from "@/app/_components/CenteredContent";
import RankedMealsTable from "@/app/_components/RankedMealsTable";
import RankMealsButton from "@/app/_components/RankMealsButton";
import { auth, signIn } from "@/app/_utils/auth";
import { getUserAndAllMeals } from "@/app/_utils/dataAccess";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.id) {
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

  const { user, allMeals } = await getUserAndAllMeals({ userId: session.user.id });
  const seenMeals = [...user.rankedMeals, ...user.unrankedMeals];
  const newMeals = Array.from(allMeals.values()).filter(({ id }) => !seenMeals.includes(id));

  if (user.rankedMeals.length === 0) {
    return (
      <CenteredContent>
        <div className="fs-1">😔</div>
        <div>No meals ranked yet</div>
        {newMeals.length > 1 && <RankMealsButton numNewMeals={newMeals.length} />}
      </CenteredContent>
    );
  }

  return (
    <>
      {newMeals.length > 0 && <RankMealsButton numNewMeals={newMeals.length} />}
      <h2>Your ranked meals</h2>
      <RankedMealsTable mealRanks={user.rankedMeals} allMeals={allMeals} />
      {/* Hidden meals table? */}
    </>
  );
}
