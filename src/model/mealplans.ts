import { SetStateAction } from "react";

export type Props = {
    setShowMealPlans: React.Dispatch<SetStateAction<boolean>>
}

type ThreeMeals = {
    breakfast: string
    lunch: string
    dinner: string
}

export type MealPlan = {
    id: string
    name: string
    active: boolean
    dayOne: ThreeMeals
    dayTwo: ThreeMeals
    dayThree: ThreeMeals
    dayFour: ThreeMeals
    dayFive: ThreeMeals
    daySix: ThreeMeals
    daySeven: ThreeMeals
}