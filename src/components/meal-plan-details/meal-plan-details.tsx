import { memo, useState } from 'react';
import { MdOutlineArrowBack } from 'react-icons/md';
import RecipeModal from '../recipe-modal/recipe-modal';
import classNames from 'classnames';
import { BiReset } from 'react-icons/bi';
import { BsPlusCircleDotted } from 'react-icons/bs';
import { Props } from '../../model/meal-plan-details';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { resetAMeal, selectMealplanByID } from '../../state/mealplans/mealplans.slice';
import Loader from '../loader/loader';
import { Meal, MealDay } from '../../model/add-to-meal-plan-modal';
import RecipeIDSelect from './recipeid-select';

const MealPlanDetails = memo(({ mealplanId, setMealplanIdToView }: Props) => {
  const [viewRecipeWithID, setViewRecipeWithID] = useState('');
  const [selectRecipe, setSelectRecipe] = useState(false);
  const [mealData, setMealdata] = useState<{ meal: Meal | null, mealDay: MealDay | null }>({
    meal: null,
    mealDay: null,
  });
  const mealDays = ['dayOne', 'dayTwo', 'dayThree', 'dayFour', 'dayFive', 'daySix', 'daySeven'] as const;
  const mealDaysMapping = ['Day One', 'Day Two', 'Day Three', 'Day Four', 'Day Five', 'Day Six', 'Day Seven'] as const;
  const dispatch = useAppDispatch();

  const mealPlanDetails = useAppSelector(state => selectMealplanByID(state, mealplanId));

  const closeRecipeSelect = () => {
    setMealdata({
      meal: null,    
      mealDay: null,
    });
    setSelectRecipe(false);
  }

  const handleSelectRecipe = (meal: Meal, mealDay: MealDay) => {
    setMealdata({
      meal, 
      mealDay
    });
    setSelectRecipe(true);
  }

  if(!mealPlanDetails) {
      return (
          <div className="w-full relative h-[200px]">
              <Loader/>
          </div>
      )
  }

  return (
    <>
        { viewRecipeWithID && <RecipeModal recipeId={viewRecipeWithID} setViewRecipeWithID={setViewRecipeWithID}/> }

        { selectRecipe && (
          <RecipeIDSelect
            setViewRecipeWithID={setViewRecipeWithID}
            closeRecipeSelect={closeRecipeSelect}
            mealData={mealData}
            mealplan={mealPlanDetails}
          />
        ) }

        <header className="relative flex items-center justify-center my-4">
            <button onClick={() => setMealplanIdToView(null)}
                className="w-8 h-8 shadow-sm rounded-full flex items-center justify-center bg-gray-200 hover:shadow-md
                group transition-all duration-300 absolute left-0">
                <MdOutlineArrowBack size={18} className="text-gray-500 group-hover:text-black"/>
            </button>
            <h2 className="font-medium md:text-lg">{ mealPlanDetails?.name}</h2>
        </header>

        <div className='mt-8 flex justify-center flex-wrap'>
            { mealPlanDetails && mealDays.map((mealDay, idx) => (
                <div key={idx}
                    className='border border-mainBorder mb-8 sm:mx-3 last:mb-0 rounded-lg mx-auto flex flex-col w-full
                        xs:max-w-[250px]'>
                    <h2 className='py-3 font-bold border-b text-center relative'>
                        { mealDaysMapping[idx] }
                        { ( mealPlanDetails[mealDay].breakfast ||     
                            mealPlanDetails[mealDay].lunch ||
                            mealPlanDetails[mealDay].dinner ) && (
                            <button className='absolute group top-2 right-2 rounded-full text-gray-500 hover:ring-[3px]
                                hover:ring-gray-200 hover:text-gray-600 transition-all from-neutral-500'
                                onClick={() => dispatch(resetAMeal({
                                    mealplanId: mealplanId,
                                    mealday: mealDay,
                                }))}>
                                <BiReset size={20}/>
                                <span className="absolute hidden whitespace-nowrap  group-hover:block w-[90px] left-1/2 -top-2 
                                    -translate-y-full px-2 py-1 -ml-[45px]
                                    bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] 
                                    after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 
                                    after:border-x-transparent after:border-b-transparent after:border-t-gray-700 font-normal">
                                        Reset
                                </span>
                            </button>
                        ) }
                    </h2>
                    <div className='flex flex-col py-2'>
                        <div className='flex justify-center py-1'>
                            <p className='basis-1/2 text-right'>
                                Breakfast : 
                            </p>
                            <div className='basis-1/2 flex items-center'>
                              <button onClick={
                                  () => mealPlanDetails[mealDay].breakfast ? setViewRecipeWithID(mealPlanDetails[mealDay].breakfast) 
                                    : 
                                    handleSelectRecipe('breakfast', mealDay)
                                }
                                className={classNames('text-left ml-2 font-medium', 
                                mealPlanDetails[mealDay].breakfast ? 'text-theme hover:underline' : 
                                'text-gray-500 hover:ring-[3px] hover:ring-gray-200 rounded-full transition-all duration-150 p-[2px]')}>
                                { mealPlanDetails[mealDay].breakfast ? ('#' + mealPlanDetails[mealDay].breakfast) : <BsPlusCircleDotted/> }
                              </button>
                            </div>
                        </div>
                        <div className='flex justify-center py-1'>   
                            <p className='basis-1/2 text-right'>
                                Lunch : 
                            </p>
                            <div className='basis-1/2 flex items-center'>
                              <button onClick={
                                  () => mealPlanDetails[mealDay].lunch ? setViewRecipeWithID(mealPlanDetails[mealDay].lunch) 
                                    : 
                                    handleSelectRecipe('lunch', mealDay)
                                }
                                  className={classNames('text-left ml-2 font-medium', 
                                  mealPlanDetails[mealDay].lunch ? 'text-theme hover:underline' : 
                                  'text-gray-500  hover:ring-[3px] hover:ring-gray-200 rounded-full transition-all duration-150 p-[2px]')}>
                                  { mealPlanDetails[mealDay].lunch ? ('#' + mealPlanDetails[mealDay].lunch) : <BsPlusCircleDotted/> }
                              </button>
                            </div>
                        </div>
                        <div className='flex justify-center py-1'>
                            <p className='basis-1/2 text-right'>
                                Dinner : 
                            </p>
                            <div className='basis-1/2 flex items-center'>
                              <button onClick={
                                  () => mealPlanDetails[mealDay].dinner ? setViewRecipeWithID(mealPlanDetails[mealDay].dinner) 
                                    : 
                                    handleSelectRecipe('dinner', mealDay)
                                }
                                className={classNames('text-left ml-2 font-medium', 
                                mealPlanDetails[mealDay].dinner ? 'text-theme hover:underline' : 
                                'text-gray-500  hover:ring-[3px] hover:ring-gray-200 rounded-full transition-all duration-150 p-[2px]')}>
                                { mealPlanDetails[mealDay].dinner ? ('#' + mealPlanDetails[mealDay].dinner) : <BsPlusCircleDotted/> }
                              </button>
                            </div>
                        </div>
                    </div>
                </div>
            )) }
        </div>
    </>
  )
});

export default MealPlanDetails;