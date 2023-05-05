import { DocumentData } from "firebase/firestore";
import { SetStateAction } from "react";

export type Props = {
    recipeId: string
    setRecipeIdToAdd: React.Dispatch<SetStateAction<string>>
}
export type MealDay = 'dayOne' | 'dayTwo' | 'dayThree' | 'dayFour' | 'dayFive' | 'daySix' | 'daySeven';

export type Meal = 'breakfast' | 'lunch' | 'dinner';

export type MealDataType = {
    mealDay: MealDay | null
    meal: Meal | null
    mealPlan: DocumentData | null
}

export type AddToMealplanError = {
    mealDay?: string
    meal?: string
    mealPlan?: string
}