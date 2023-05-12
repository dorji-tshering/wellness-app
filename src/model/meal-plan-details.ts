import { SetStateAction } from "react";

export type Props = {
    mealPlanID: string
    setMealplanIdToView: React.Dispatch<SetStateAction<string | null>>
}

export type MealDay = 'dayOne' | 'dayTwo' | 'dayThree' | 'dayFour' | 'dayFive' | 'daySix' | 'daySeven';
