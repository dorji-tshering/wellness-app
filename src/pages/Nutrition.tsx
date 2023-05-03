import DesktopPageHeader from "../components/DesktopPageHeader";
import MobilePageHeader from "../components/MobilePageHeader";
import IsMobile from "../utils/useMediaQuery";
import DisplayRecipe from "../components/DisplayRecipe";
import MealPlans from "../components/MealPlans";
import { useState } from "react";
import MealPlanForm from "../components/MealPlanForm";
import classNames from "classnames";

const Nutrition = () => {
    const {isMobile} = IsMobile();
    const [showMealPlans, setShowMealPlans] = useState(false);
    const [addMealPlan, setAddMealPlan] = useState(false);

    return (
        <>

            { !isMobile && (
                <DesktopPageHeader>
                    <div className="flex justify-between">
                        <h1 className="text-xl">Manage Nutrition</h1>
                        <div>
                            { showMealPlans && (
                                <button className="text-sm rounded-md px-3 py-2 font-medium bg-gray-100 text-theme mr-5
                                    hover:bg-gray-200 shadow-sm shadow-black/30" 
                                    onClick={() => setShowMealPlans(false)}>
                                    Recipes
                                </button>
                            ) }
                            <button 
                                onClick={() => showMealPlans ? setAddMealPlan(true) : setShowMealPlans(true)}
                                className={classNames('text-sm rounded-md px-3 py-2 font-medium shadow-sm',
                                showMealPlans ? 'bg-theme hover:bg-themeHover text-white shadow-black/50' : 
                                'bg-gray-100 hover:bg-gray-200 text-theme shadow-black/30 transition-all duration-300')}>
                                { showMealPlans ? 'Add meal plan' : 'Meal plans' }
                            </button>
                        </div>
                    </div>
                </DesktopPageHeader>
            ) }

            { isMobile && (
                <MobilePageHeader> 
                    <div className="flex justify-between">
                        <h1 className="text-lg mr-2">Manage Nutrition</h1>
                        <div className="flex flex-col xs:flex-row-reverse">
                            <button 
                                onClick={() => showMealPlans ? setAddMealPlan(true) : setShowMealPlans(true)}
                                className={classNames('text-[13px] rounded-md px-2 py-1 font-medium shadow-sm h-fit whitespace-nowrap',
                                showMealPlans ? 'bg-theme hover:bg-themeHover text-white shadow-black/50' : 
                                'bg-gray-100 hover:bg-gray-200 text-theme shadow-black/30 transition-all duration-300')}>
                                { showMealPlans ? 'Add meal plan' : 'Meal plans' }
                            </button>
                            { showMealPlans && (
                                    <button className="text-sm rounded-md px-2 py-1 font-medium bg-gray-100 text-theme mt-4 xs:mt-0
                                        xs:mr-3 hover:bg-gray-200 shadow-sm shadow-black/30 ml-auto" 
                                        onClick={() => setShowMealPlans(false)}>
                                        Recipes
                                    </button>
                            ) }
                        </div>
                    </div>
                </MobilePageHeader>
            ) }

            { addMealPlan && <MealPlanForm setAddMealPlan={setAddMealPlan}/> }

            <div>
                {
                    showMealPlans ? (
                        <MealPlans 
                            setShowMealPlans={setShowMealPlans}/>
                    ) : <DisplayRecipe/>
                }
            </div>
        </>
    )
}

export default Nutrition;