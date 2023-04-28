import { useState } from 'react';
import Recipes from "../utils/recipes";
import { AiOutlinePlus } from 'react-icons/ai';
import RecipeModal from "./RecipeModal";
import AddToMealPlanModal from "./AddToMealPlanModal";
import NutrientStats from './NutrientStats';


const DisplayRecipe = () => {
    const [viewRecipeWithID, setViewRecipeWithID] = useState('');
    const [recipeIdToAdd, setRecipeIdToAdd] = useState('');
    
    return (
        <>
            { viewRecipeWithID && <RecipeModal recipeId={viewRecipeWithID} setViewRecipeWithID={setViewRecipeWithID}/> }

            { recipeIdToAdd && <AddToMealPlanModal recipeId={recipeIdToAdd} setRecipeIdToAdd={setRecipeIdToAdd}/> }

            <NutrientStats/>

            <h2 className="my-5">A list of recipes to keep you healthy.</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 lg:gap-y-16">
                { Recipes.map((recipe, idx) => (
                    <div className="flex flex-col shadow-sm border border-mainBorder rounded-md overflow-hidden"
                        key={idx}>
                        <button className="grow flex flex-col items-center group"
                        onClick={() => setViewRecipeWithID(recipe.id)}>
                            <div className="h-[80%] overflow-hidden">
                                <img 
                                    src={recipe.image} 
                                    alt={recipe.name} 
                                    className="object-cover h-[120%] w-[120%] group-hover:scale-[120%] transition-transform 
                                    duration-300 ease-out"/>
                            </div>
                            <p className="grow font-bold text-[18px] py-2 group-hover:bg-gray-100 w-full">{recipe.name}</p>
                        </button>
                        <button className="py-3 block relative group border-t border-t-mainBorder hover:bg-theme/5 hover:text-theme"
                            aria-label='Add to meal plan' onClick={() => setRecipeIdToAdd(recipe.id)}>
                            <AiOutlinePlus className="mx-auto" size={20}/>
                            <span className="absolute hidden  group-hover:block w-fit mx-auto left-0 right-0 -top-2 -translate-y-full px-2 py-1
                                bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] 
                                after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 
                                after:border-x-transparent after:border-b-transparent after:border-t-gray-700">Add to meal plan</span>
                        </button>
                    </div>
                )) }
            </div>
        </>
    )
}

export default DisplayRecipe;