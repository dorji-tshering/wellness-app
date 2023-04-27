import { FormEvent, SetStateAction, useEffect, useState } from 'react';
import classNames from 'classnames';
import { DocumentData, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Loader from './Loader';
import { useAuthValue } from '../utils/authContext';
import { database } from '../firebaseClient';
import { useNotification } from '../utils/notificationContext';

type Props = {
    recipeId: string
    setRecipeIdToAdd: React.Dispatch<SetStateAction<string>>
}
type MealDay = 'dayOne' | 'dayTwo' | 'dayThree' | 'dayFour' | 'dayFive' | 'daySix' | 'daySeven';
type Meal = 'breakfast' | 'lunch' | 'dinner';
type MealDataType = {
    mealDay: MealDay | null
    meal: Meal | null
    mealPlan: DocumentData | null
}

const AddToMealPlanModal = ({ recipeId, setRecipeIdToAdd }: Props) => {
    const [mealPlans, setMealPlans] = useState<Array<DocumentData> | null>(null);
    const [mealData, setMealData] = useState<MealDataType>({
        mealDay: null,
        meal: null,
        mealPlan: null,
    });
    const [loadingData, setLoadingData] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [showMealPlanOptions, setShowMealPlanOptions] = useState(false);
    const [showMealDayOptions, setShowMealDayOptions] = useState(false);
    const [showMealOptions, setShowMealOptions] = useState(false);
    const user = useAuthValue();
    const setNotification = useNotification()?.setNotification;

    const mealDayOptions: {[index: string]: string} = {
        'Day One': 'dayOne',
        'Day Two': 'dayTwo',
        'Day Three': 'dayThree',
        'Day Four': 'dayFour',
        'Day Five': 'dayFive',
        'Day Six': 'daySix',
        'Day Seven': 'daySeven',
    };
    const mealOptions = ['Breakfast', 'Lunch', 'Dinner'];

    useEffect(() => {
        const q = query(collection(database, 'mealplans'), where('userId', '==', user?.uid));
        getDocs(q).then((querySnapshot) => {
            setMealPlans(querySnapshot.docs);
            setLoadingData(false);
        }).catch((err) => {
            console.log(err.code);
        })
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const addRecipeToMealPlan = async(event: FormEvent) => {
        event.preventDefault();

        if(mealData.mealPlan && mealData.mealDay && mealData.meal) {
            setFormSubmitting(true);
            try {
                await updateDoc(doc(database, 'mealplans', mealData.mealPlan?.id), {
                    [`${mealData.mealDay}.${mealData.meal}`]: recipeId, 
                })
                setFormSubmitting(false);
                setNotification && setNotification('Recipe added to meal successfully.');
                setRecipeIdToAdd('');
            }catch(err: any) {
                console.log(err.code);
            }
        }else {
            if(!mealData.mealPlan) {
                setFormError('Please select a meal plan');
                return;
            }else if(!mealData.mealDay) {
                setFormError('Please select a meal day');
                return;
            }else if (!mealData.meal) {
                setFormError('Please select a meal');
                return;
            }
        }
    }

    return (
        <div className="fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-30 flex justify-center items-center px-4 py-5"
            onClick={() => setRecipeIdToAdd('')}>
            { loadingData ? (
                <div className='min-w-full xs:min-w-[360px] py-20 flex justify-center items-center bg-white rounded-md'>
                    <Loader/>
                </div>
            ) : (
                <div className="max-h-full overflow-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={addRecipeToMealPlan}
                        className="bg-white rounded-md shadow-md px-3 xs:px-8 py-5">
                        <h1 className='text-center font-medium mb-4'>Select a meal to add recipe to.</h1>
                        { formError && <p className='text-sm text-red-600 text-center -mt-4 mb-3'>{ formError }</p> }
                        <div className='flex justify-center flex-wrap'>
                            <p aria-label='Meal plan' onClick={() => setShowMealPlanOptions(true)}
                                className={classNames('mx-2 border border-gray-600 rounded-[4px] px-3 py-1 cursor-pointer mb-4', 
                                !mealData.mealPlan?.data().name && 'text-gray-500')}>
                                { mealData.mealPlan?.data().name ? mealData.mealPlan?.data().name : '--Select Mealplan--' }
                            </p>
                            <p aria-label='Meal day' onClick={() => setShowMealDayOptions(true)}
                                className={classNames('mx-2 border border-gray-600 rounded-[4px] px-3 py-1 cursor-pointer mb-4', 
                                !mealData.mealDay && 'text-gray-500')}>
                                { mealData.mealDay ? Object.keys(mealDayOptions).find(key => mealDayOptions[key] === mealData.mealDay) : '--Select Mealday--' }
                            </p>
                            <p aria-label='Meal' onClick={() => setShowMealOptions(true)}
                                className={classNames('mx-2 border border-gray-600 rounded-[4px] px-3 py-1 cursor-pointer mb-4', 
                                !mealData.meal && 'text-gray-500')}>
                                { mealData.meal ? (mealData.meal.charAt(0).toUpperCase() + mealData.meal.slice(1)) : '--Select Meal--' }
                            </p>
                        </div>
                        <div className='flex justify-center'>
                            <button type='submit'
                                className='bg-theme hover:bg-themeHover text-sm rounded-[4px] py-2 text-white font-medium
                                w-[80px] mr-2'>{ formSubmitting ? '. . .' : 'Add' }</button>
                            <button onClick={() => setRecipeIdToAdd('')} type='button'
                                className='hover:bg-gray-100 text-sm rounded-[4px] py-2 font-medium border border-mainBorder
                                w-[80px] ml-2'>Cancel</button>
                        </div>
                    </form>
                </div>
            ) }

            {/* mealPlan select */}
            { mealPlans && mealPlans?.length > 0 && showMealPlanOptions && (
                <div className='absolute top-0 right-0 left-0 bottom-0 z-40 flex items-center justify-center bg-black/30 px-4 py-5'
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMealPlanOptions(false)
                    }}>
                    <div className="max-h-full overflow-auto rounded-md min-w-[200px]" 
                        onClick={(e) => e.stopPropagation()}>
                        <ul className='bg-white rounded-md py-2'>
                            { mealPlans.map((mealPlan, idx) => (
                                <li className={classNames('text-center py-2 px-8 cursor-pointer',
                                    mealData.mealPlan?.data().name === mealPlan.data().name ? 'bg-theme text-white' : 
                                    'hover:bg-gray-100')}
                                    key={idx}
                                    onClick={() => {
                                        setMealData({
                                            ...mealData,
                                            mealPlan
                                        });
                                        setShowMealPlanOptions(false);
                                    }}>
                                    { mealPlan.data().name }
                                </li>
                            )) }
                        </ul>
                    </div>
                </div>
            ) }
            {/* mealDay select */}
            { showMealDayOptions && (
                <div className='absolute top-0 right-0 left-0 bottom-0 z-40 flex items-center justify-center bg-black/30 px-4 py-5'
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMealDayOptions(false);
                    }}>
                    <div className="max-h-full overflow-auto rounded-md min-w-[200px]" 
                        onClick={(e) => e.stopPropagation()}>
                        <ul className='bg-white rounded-md py-2'>
                            { Object.keys(mealDayOptions).map((day, idx) => (
                                <li className={classNames('text-center py-2 px-8 cursor-pointer',
                                    mealData.mealDay === mealDayOptions[day] ? 'bg-theme text-white' : 
                                    'hover:bg-gray-100')}
                                    key={idx}
                                    onClick={() => {
                                        setMealData({
                                            ...mealData,
                                            mealDay: mealDayOptions[day] as MealDay
                                        });
                                        setShowMealDayOptions(false);
                                    }}>
                                    { day }
                                </li>
                            )) }
                        </ul>
                    </div>
                </div>
            ) }
            {/* meal select */}
            { showMealOptions && (
                <div className='absolute top-0 right-0 left-0 bottom-0 z-40 flex items-center justify-center bg-black/30 px-4 py-5'
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMealOptions(false);
                    }}>
                    <div className="max-h-full overflow-auto rounded-md min-w-[200px]" 
                        onClick={(e) => e.stopPropagation()}>
                        <ul className='bg-white rounded-md py-2'>
                            { mealOptions.map((meal, idx) => (
                                <li className={classNames('text-center py-2 px-8 cursor-pointer',
                                    mealData.meal?.toLowerCase() === meal.toLowerCase() ? 'bg-theme text-white' : 
                                    'hover:bg-gray-100')}
                                    key={idx}
                                    onClick={() => {
                                        setMealData({
                                            ...mealData,
                                            meal: meal.toLowerCase() as Meal
                                        });
                                        setShowMealOptions(false);
                                    }}>
                                    { meal }
                                </li>
                            )) }
                        </ul>
                    </div>
                </div>
            ) }
        </div>
    )
}

export default AddToMealPlanModal;