import { SetStateAction } from "react";
import { MealPlan } from "./mealplans";

export type Props = {
    mealplanId: string
    setMealplanIdToView: React.Dispatch<SetStateAction<string | null>>
}

export type MealDay = 'dayOne' | 'dayTwo' | 'dayThree' | 'dayFour' | 'dayFive' | 'daySix' | 'daySeven';
