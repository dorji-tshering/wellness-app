import { useEffect, useState } from 'react';
import classNames from 'classnames';
import Loader from '../loader/loader';
import { useAuthValue } from '../../hooks/use-auth-context';
import { useNotification } from '../../hooks/use-notification-context';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { AddToMealplanError, Meal, MealDataType, MealDay, Props } from '../../model/add-to-meal-plan-modal';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { addRecipeToMealplan, fetchMealplans, selectFetchStatus, selectMealplans } from '../../state/mealplans/mealplans.slice';

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

const AddToMealPlanModal = ({ recipeId, setRecipeIdToAdd }: Props) => {
    const [showMealPlanOptions, setShowMealPlanOptions] = useState(false);
    const [showMealDayOptions, setShowMealDayOptions] = useState(false);
    const [showMealOptions, setShowMealOptions] = useState(false);
    const user = useAuthValue();
    const setNotification = useNotification()?.setNotification;
    const fetchStatus = useAppSelector(selectFetchStatus);
    const mealPlans = useAppSelector(selectMealplans);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(user && fetchStatus === 'idle') {
            dispatch(fetchMealplans(user.uid));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const handleRecipeAddToMealplan = async(values: MealDataType) => {
        try {
            await dispatch(addRecipeToMealplan({recipeId, values}));
            setNotification && setNotification('Recipe added to meal successfully.');
            setRecipeIdToAdd('');
        }catch(err: any) {
            return { [FORM_ERROR]: err.code }
        }
    }
    
    return (
        <div className="fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-30 flex justify-center items-center px-4 py-5"
            onClick={() => setRecipeIdToAdd('')}>
            { fetchStatus === 'idle' || fetchStatus === 'pending' ? (
                <div className='min-w-full xs:min-w-[360px] py-20 flex justify-center items-center bg-white rounded-md'>
                    <Loader/>
                </div>
            ) : (
                <div className="max-h-full overflow-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                    <Form onSubmit={handleRecipeAddToMealplan}
                        validate={(values) => {
                            const errors: AddToMealplanError = {};
                            if(!values.meal) {
                                errors.meal = 'Required';
                            }
                            if(!values.mealDay) {
                                errors.mealDay = 'Required';
                            }
                            if(!values.mealPlan) {
                                errors.mealPlan = 'Required';
                            }
                            return errors;
                        }}>
                        {({ handleSubmit, submitting, values, submitError }) => (
                            <>
                                <form onSubmit={handleSubmit}
                                    className='bg-white rounded-md shadow-md px-3 xs:px-8 py-5'>
                                    <h1 className='text-center font-medium mb-4'>Select a meal to add recipe to.</h1>
                                    { submitError && <p className='text-xs text-red-600 mb-3 text-center -mt-3'>{ submitError }</p> }
                                    <div className='flex justify-center flex-wrap'>
                                        <Field name='mealPlan'>
                                            {({ meta }) => (
                                                <div className='flex flex-col mb-4'>
                                                    <p aria-label='Meal plan' onClick={() => setShowMealPlanOptions(true)}
                                                        className={classNames('mx-2 border border-gray-600 rounded-[4px] px-3 py-1 cursor-pointer', 
                                                        !values.mealPlan?.name && 'text-gray-500')}>
                                                        { values.mealPlan?.name ?? '--Select Mealplan--' }
                                                    </p>
                                                    { meta.error && meta.touched && <span className="text-xs text-center text-red-700">
                                                        { meta.error }
                                                    </span> }
                                                </div>
                                            )}
                                        </Field>
                                        <Field name='mealDay'>
                                            {({ meta }) => (
                                                <div className='flex flex-col mb-4'>
                                                    <p aria-label='Meal day' onClick={() => setShowMealDayOptions(true)}
                                                        className={classNames('mx-2 border border-gray-600 rounded-[4px] px-3 py-1 cursor-pointer', 
                                                        !values.mealDay && 'text-gray-500')}>
                                                        { values.mealDay ? Object.keys(mealDayOptions).find(key => 
                                                        mealDayOptions[key] === values.mealDay) 
                                                        : '--Select Mealday--' }
                                                    </p>
                                                    { meta.error && meta.touched &&  <span className="text-xs text-center text-red-700">
                                                        { meta.error }
                                                    </span> }
                                                </div>
                                            )}
                                        </Field>
                                        <Field name='meal'>
                                            {({ meta }) => (
                                                <div className='flex flex-col mb-4'>
                                                    <p aria-label='Meal' onClick={() => setShowMealOptions(true)}
                                                        className={classNames('mx-2 border border-gray-600 rounded-[4px] px-3 py-1 cursor-pointer', 
                                                        !values.meal && 'text-gray-500')}>
                                                        { values.meal ? (values.meal.charAt(0).toUpperCase() + values.meal.slice(1)) : '--Select Meal--' }
                                                    </p>
                                                    { meta.error && meta.touched && <span className="text-xs text-center text-red-700">
                                                        { meta.error }
                                                    </span> }
                                                </div>
                                            )}
                                        </Field>
                                    </div>
                                    <div className='flex justify-center'>
                                        <button type='submit'
                                            className='bg-theme hover:bg-themeHover text-sm rounded-[4px] py-2 text-white font-medium
                                            w-[80px] mr-2'>{ submitting ? '. . .' : 'Add' }</button>
                                        <button onClick={() => setRecipeIdToAdd('')} type='button'
                                            className='hover:bg-gray-100 text-sm rounded-[4px] py-2 font-medium border border-mainBorder
                                            w-[80px] ml-2'>Cancel</button>
                                    </div>
                                </form>
                                {/* mealPlan select */}
                                { mealPlans && !!mealPlans?.length && showMealPlanOptions && (
                                    <div className='absolute top-0 right-0 left-0 bottom-0 z-40 flex items-center justify-center bg-black/30 px-4 py-5'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMealPlanOptions(false);
                                        }}>
                                        <div className="max-h-full overflow-auto rounded-md min-w-[200px]" 
                                            onClick={(e) => e.stopPropagation()}>
                                            <ul className='bg-white rounded-md py-2'>
                                                { mealPlans.map((mealPlan, idx) => (
                                                    <li className={classNames('text-center py-2 px-8 cursor-pointer',
                                                        values.mealPlan?.name === mealPlan.name ? 'bg-theme text-white' : 
                                                        'hover:bg-gray-100')}
                                                        key={idx}
                                                        onClick={() => {
                                                            values.mealPlan = mealPlan;
                                                            setShowMealPlanOptions(false);
                                                        }}>
                                                        { mealPlan.name }
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
                                                        values.mealDay === mealDayOptions[day] ? 'bg-theme text-white' : 
                                                        'hover:bg-gray-100')}
                                                        key={idx}
                                                        onClick={() => {
                                                            values.mealDay = mealDayOptions[day] as MealDay;
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
                                                        values.meal?.toLowerCase() === meal.toLowerCase() ? 'bg-theme text-white' : 
                                                        'hover:bg-gray-100')}
                                                        key={idx}
                                                        onClick={() => {
                                                            values.meal = meal.toLowerCase() as Meal;
                                                            setShowMealOptions(false);
                                                        }}>
                                                        { meal }
                                                    </li>
                                                )) }
                                            </ul>
                                        </div>
                                    </div>
                                ) }
                            </>
                        )}
                    </Form>
                </div>
            ) }

            
        </div>
    )
}

export default AddToMealPlanModal;