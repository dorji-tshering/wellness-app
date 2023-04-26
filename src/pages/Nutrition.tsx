import DesktopPageHeader from "../components/DesktopPageHeader";
import MobilePageHeader from "../components/MobilePageHeader";
import IsMobile from "../utils/useMediaQuery";
import DisplayRecipe from "../components/DisplayRecipe";
import MealPlans from "../components/MealPlans";

const Nutrition = () => {
    const isMobile = IsMobile();

    return (
        <div>

            { !isMobile && (
                <DesktopPageHeader>
                    <div className="flex justify-between">
                        <h1 className="text-xl">Manage Nutrition</h1>
                        <button 
                            onClick={() => {}}
                            className="text-sm bg-theme hover:bg-themeHover text-white rounded-md px-3 py-2 font-medium">Meal plans</button>
                    </div>
                </DesktopPageHeader>
            ) }

            { isMobile && (
                <MobilePageHeader> 
                    <div className="flex justify-between">
                        <h1>Manage Nutrition</h1>
                        <button 
                            onClick={() => {}}
                            className="text-sm bg-theme text-white font-medium rounded-md px-3 py-2">Meal plans</button>
                    </div>
                </MobilePageHeader>
            ) }

            <div>
                <DisplayRecipe/>
            </div>
        </div>
    )
}

export default Nutrition;