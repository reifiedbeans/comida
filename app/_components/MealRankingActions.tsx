import { FC } from "react";

import Meal from "@/app/_types/Meal";

interface Props {
  readonly meal: Meal;
  readonly onSelect: (meal: Meal) => void;
  readonly onHide?: (meal: Meal) => void;
}

const selectButtonText = "This one";
const hideButtonText = "I didn't eat this";

const MealRankingActions: FC<Props> = ({ meal, onSelect, onHide }) => {
  return (
    <div className="d-grid gap-2 d-md-flex">
      <button type="button" className="btn btn-primary" onClick={() => onSelect(meal)}>
        {selectButtonText}
      </button>
      {onHide && (
        <button type="button" className="btn btn-secondary" onClick={() => onHide(meal)}>
          {hideButtonText}
        </button>
      )}
    </div>
  );
};

export default MealRankingActions;
