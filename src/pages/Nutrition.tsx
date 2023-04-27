import DesktopPageHeader from "../components/DesktopPageHeader";
import MobilePageHeader from "../components/MobilePageHeader";
import IsMobile from "../utils/useMediaQuery";
import DisplayRecipe from "../components/DisplayRecipe";
import MealPlans from "../components/MealPlans";
import { useState } from "react";

const Nutrition = () => {
    const isMobile = IsMobile();
    const [showMealPlans, setShowMealPlans] = useState(false);
    const [addMealPlan, setAddMealPlan] = useState(false);

    return (
        <div>

            { !isMobile && (
                <DesktopPageHeader>
                    <div className="flex justify-between">
                        <h1 className="text-xl">Manage Nutrition</h1>
                        <button 
                            onClick={() => showMealPlans ? setAddMealPlan(true) : setShowMealPlans(true)}
                            className="text-sm bg-theme hover:bg-themeHover text-white rounded-md px-3 py-2 font-medium">
                            { showMealPlans ? 'Add meal plan' : 'Meal plans' }
                        </button>
                    </div>
                </DesktopPageHeader>
            ) }

            { isMobile && (
                <MobilePageHeader> 
                    <div className="flex justify-between">
                        <h1>Manage Nutrition</h1>
                        <button 
                            onClick={() => showMealPlans ? setAddMealPlan(true) : setShowMealPlans(true)}
                            className="text-sm bg-theme text-white font-medium rounded-md px-3 py-2">
                            { showMealPlans ? 'Add meal plan' : 'Meal plans' }
                        </button>
                    </div>
                </MobilePageHeader>
            ) }

            <div>
                {
                    showMealPlans ? (
                        <MealPlans 
                            addMealPlan={addMealPlan} 
                            setAddMealPlan={setAddMealPlan}
                            setShowMealPlans={setShowMealPlans}/>
                    ) : <DisplayRecipe/>
                }
            </div>
        </div>
    )
}

export default Nutrition;