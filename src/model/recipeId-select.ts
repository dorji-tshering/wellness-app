import { Meal, MealDay } from "./add-to-meal-plan-modal"
import { MealPlan } from "./mealplans"

export type Props = {
  mealplan: MealPlan
  setViewRecipeWithID: React.Dispatch<React.SetStateAction<string>>
  closeRecipeSelect: () => void
  mealData: {
    meal: Meal | null           
    mealDay: MealDay | null
  }
}