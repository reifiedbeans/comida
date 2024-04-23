import Link from "next/link";

interface Props {
  readonly numNewMeals: number;
}

export default function RankMealsButton({ numNewMeals }: Props) {
  return (
    <div className="d-grid d-sm-flex mb-4">
      <Link href="/ranking" className="btn btn-primary" role="button">
        Rank {numNewMeals} new {numNewMeals == 1 ? "meal" : "meals"}
      </Link>
    </div>
  );
}
