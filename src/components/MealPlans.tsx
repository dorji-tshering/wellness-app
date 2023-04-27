import MealPlanForm from "./MealPlanForm";
import { SetStateAction } from 'react';


type Props = {
    addMealPlan: boolean
    setAddMealPlan: React.Dispatch<SetStateAction<boolean>>
    setShowMealPlans: React.Dispatch<SetStateAction<boolean>>
}

const MealPlans = ({ addMealPlan, setAddMealPlan, setShowMealPlans }: Props) => {


    return (
        <>
            { addMealPlan && <MealPlanForm setAddMealPlan={setAddMealPlan}/> }
            <div>
                <button onClick={() => setShowMealPlans(false)}>back</button>
            </div>
        </>
    )
}

export default MealPlans;