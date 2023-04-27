import { DocumentData } from 'firebase/firestore';
import React from 'react'
import { SetStateAction, useState } from 'react';
import { MdOutlineArrowBack } from 'react-icons/md';
import RecipeModal from './RecipeModal';
import classNames from 'classnames';

type Props = {
    mealPlanDetails: DocumentData
    viewMealPlanDetails: React.Dispatch<SetStateAction<DocumentData | null>>
}

const MealPlanDetails = ({ mealPlanDetails, viewMealPlanDetails }: Props) => {
    const [viewRecipeWithID, setViewRecipeWithID] = useState('');
    const mealDays = ['dayOne', 'dayTwo', 'dayThree', 'dayFour', 'dayFive', 'daySix', 'daySeven'] as const;
    const mealDaysMapping = ['Day One', 'Day Two', 'Day Three', 'Day Four', 'Day Five', 'Day Six', 'Day Seven'] as const;
    
    console.log(!!mealPlanDetails.data()['dayOne'].breakfast)

    return (
        <>
            { viewRecipeWithID && <RecipeModal recipeId={viewRecipeWithID} setViewRecipeWithID={setViewRecipeWithID}/> }

            <header className="relative flex items-center justify-center my-4">
                <button onClick={() => viewMealPlanDetails(null)}
                    className="w-8 h-8 shadow-sm rounded-full flex items-center justify-center bg-gray-200 hover:shadow-md
                    group transition-all duration-300 absolute left-0">
                    <MdOutlineArrowBack size={18} className="text-gray-500 group-hover:text-black"/>
                </button>
                <h2 className="font-medium md:text-lg">{mealPlanDetails.data().name}</h2>
            </header>

            <div className='mt-8 flex justify-center flex-wrap'>
                { mealDays.map((mealDay, idx) => (
                    <div key={idx}
                        className='border border-mainBorder mb-8 last:mb-0 rounded-lg mx-auto flex flex-col w-full
                            xs:max-w-[300px]'>
                        <h2 className='py-3 font-bold border-b text-center'>{ mealDaysMapping[idx] }</h2>
                        <div className='flex flex-col py-2'>
                            <div className='flex justify-center py-1'>
                                <p className='basis-1/2 text-right'>
                                    Breakfast : 
                                </p>
                                <button onClick={() => setViewRecipeWithID(mealPlanDetails.data()[mealDay].breakfast)}
                                    disabled={mealPlanDetails.data()[mealDay].breakfast ? false : true}
                                    className={classNames('basis-1/2 text-left ml-2 font-medium', 
                                    mealPlanDetails.data()[mealDay].breakfast ? 'text-theme hover:underline' : 
                                    'text-gray-500')}>
                                    { mealPlanDetails.data()[mealDay].breakfast ? ('#' + mealPlanDetails.data()[mealDay].breakfast) : 'Not added' }
                                </button>
                            </div>
                            <div className='flex justify-center py-1'>
                                <p className='basis-1/2 text-right'>
                                    Lunch : 
                                </p>
                                <button onClick={() => setViewRecipeWithID(mealPlanDetails.data()[mealDay].lunch)}
                                    disabled={mealPlanDetails.data()[mealDay].lunch ? false : true}
                                    className={classNames('basis-1/2 text-left ml-2 font-medium', 
                                    mealPlanDetails.data()[mealDay].lunch ? 'text-theme hover:underline' : 
                                    'text-gray-500')}>
                                    { mealPlanDetails.data()[mealDay].lunch ? ('#' + mealPlanDetails.data()[mealDay].lunch) : 'Not added' }
                                </button>
                            </div>
                            <div className='flex justify-center py-1'>
                                <p className='basis-1/2 text-right'>
                                    Dinner : 
                                </p>
                                <button onClick={() => setViewRecipeWithID(mealPlanDetails.data()[mealDay].dinner)}
                                    disabled={mealPlanDetails.data()[mealDay].dinner ? false : true}
                                    className={classNames('basis-1/2 text-left ml-2 font-medium', 
                                    mealPlanDetails.data()[mealDay].dinner ? 'text-theme hover:underline' : 
                                    'text-gray-500')}>
                                    { mealPlanDetails.data()[mealDay].dinner ? ('#' + mealPlanDetails.data()[mealDay].dinner) : 'Not added' }
                                </button>
                            </div>
                        </div>
                    </div>
                )) }
            </div>
        </>
    )
}

export default MealPlanDetails;