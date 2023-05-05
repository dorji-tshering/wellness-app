import { SetStateAction } from "react";

export type Props = {
    setAddMealPlan: React.Dispatch<SetStateAction<boolean>>
}

export type MealPlanProps = {
    mealplanName: string
}

export type MealPlanFormError = {
    mealplanName?: string
}