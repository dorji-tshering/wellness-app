import classNames from "classnames";
import Recipes from "../../utils/recipes"
import { useState } from 'react';
import { useAppDispatch } from "../../state/hooks";
import { addRecipeToMealplan } from "../../state/mealplans/mealplans.slice";
import { Props } from "../../model/recipeId-select";

const RecipeIDSelect = ({ 
  closeRecipeSelect,
  setViewRecipeWithID,
  mealData,
  mealplan
}: Props) => {
  const [recipeId, setRecipeId] = useState('');
  const [adding, setAdding] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddRecipeToMealplan = async() => {
    setAdding(true);
    await dispatch(addRecipeToMealplan({
      recipeId,
      values: {
        meal: mealData.meal,
        mealDay: mealData.mealDay,
        mealPlan: mealplan
      }
    }));
    setAdding(false);
    closeRecipeSelect();
  }

  return (
    <div className='fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-30 flex justify-center items-center px-4 py-5'
      onClick={() => closeRecipeSelect()}>
      <div className='max-h-full overflow-auto rounded-md'>
        <div className='bg-white rounded-md shadow-md px-10 py-5 xs:max-w-[380px] sm:max-w-[450px] md:max-w-[700px]'
          onClick={(e) => e.stopPropagation()}>
            { Recipes.map((recipe, idx) => (
              <div key={idx}
                className="mb-2 flex justify-between"
              >
                <button 
                  className="text-theme mr-8"
                  onClick={() => setViewRecipeWithID(recipe.id)}>
                  #{recipe.id}
                </button>
                <button 
                  className={classNames('text-sm py-1 px-2 rounded-[4px] text-gray-600 border', 
                  recipeId === recipe.id && 'bg-theme text-white')}
                  onClick={() => setRecipeId(recipe.id)}>
                  Select
                </button>
              </div>
            )) }
          <div className="flex justify-end mt-5 border-t pt-4">
            <button 
              className="text-sm text-gray-600 rounded-[4px] hover:bg-gray-200 py-1 px-3"
              onClick={() => closeRecipeSelect()}>
              Cancel
            </button>
            <button 
              className={classNames(`py-1 px-3 bg-theme text-white text-sm font-medium rounded-[4px] ml-5
              hover:bg-themeHover`, !recipeId && 'opacity-50')}
              disabled={recipeId ? false : true}
              onClick={handleAddRecipeToMealplan}>
              { adding ? '. . .' : 'Add' }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeIDSelect;