import { addDoc, collection, getCountFromServer } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { database } from '../firebaseClient';
import { useAuthValue } from "../utils/auth-context";
import { useNotification } from "../utils/notification-context";
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from "final-form";
import { MealPlanFormError, MealPlanProps, Props } from "../model/mealplan-form";

const MealPlanForm = ({ setAddMealPlan }: Props) => {
    const [mealplanCount, setMealplanCount] = useState(0);
    const user = useAuthValue();
    const setNotification = useNotification()?.setNotification;

    useEffect(() => {
        getCountFromServer(collection(database, 'mealplans')).then((countObject) => {
            setMealplanCount(countObject.data().count);
        });
    }, []);

    const createMealPlan = async(values: MealPlanProps) => {
        const { mealplanName } = values;

            try {
                await addDoc(collection(database, 'mealplans'), {
                    name: mealplanName,
                    userId: user?.uid,
                    active: mealplanCount > 0 ? false : true,
                    dayOne: {
                        breakfast: '',
                        lunch: '',
                        dinner: ''
                    },
                    dayTwo: {
                        breakfast: '',
                        lunch: '',
                        dinner: ''
                    },
                    dayThree: {
                        breakfast: '',
                        lunch: '',
                        dinner: ''
                    },
                    dayFour: {
                        breakfast: '',
                        lunch: '',
                        dinner: ''
                    },
                    dayFive: {
                        breakfast: '',
                        lunch: '',
                        dinner: ''
                    },
                    daySix: {
                        breakfast: '',
                        lunch: '',
                        dinner: ''
                    },
                    daySeven: {
                        breakfast: '',
                        lunch: '',
                        dinner: ''
                    },
                });
            }catch(err: any) {
                return { [FORM_ERROR]: err.Error }
            }
            setNotification && setNotification('Meal plan added successfully. Now you can start adding recipes to your meal plan.');
            setAddMealPlan(false);
    }

    return (
        <div className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center bg-black/30 z-30 p-5"
            onClick={() => setAddMealPlan(false)}>
            <div className="max-h-full overflow-y-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                <Form onSubmit={createMealPlan}
                    validate={(values) => {
                        let { mealplanName } = values;
                        const errors :MealPlanFormError = {};
                        if(!mealplanName || !mealplanName.trim()) {
                            errors.mealplanName = 'Meal plan name is required'
                        }
                        return errors;
                    }}>
                    {({ handleSubmit, submitError, submitting }) => (
                        <form onSubmit={handleSubmit}
                            className="bg-white flex flex-col items-center rounded-md shadow-md px-8 py-4">
                            <h2 className="font-bold text-lg">Create Meal Plan</h2>
                            { submitError && <p className='text-xs text-red-600 mb-3 text-center -mt-3'>{ submitError }</p> }
                            <p className="text-sm text-gray-500 mb-3 text-center">Give a descriptive name for your meal plan</p>
                            <Field name="mealplanName" type="text">
                                {({ input, meta }) => (
                                    <div className="flex flex-col mb-4">
                                        <input 
                                        {...input}
                                        placeholder="Mealplan name"
                                        className="input-style mb-1"
                                        />
                                        { (meta.error) && meta.touched && <span className="text-xs text-center text-red-700">{ meta.error }</span> }
                                    </div>
                                )}
                            </Field>
                            <div>
                                <button type='submit'
                                    disabled={submitting}
                                    className="w-[80px] bg-theme text-white mr-2 rounded-[4px] text-sm font-medium py-2
                                    hover:bg-themeHover transition-all">{ submitting ? '. . .' : 'Create'}</button>
                                <button type="button"
                                    className="w-[80px] border border-mainBorder ml-2 rounded-[4px] text-sm font-medium py-2
                                    hover:bg-gray-100 transition-all"
                                    onClick={() => setAddMealPlan(false)}>Cancel</button>
                            </div>
                        </form>
                    )}
                </Form>
            </div>
        </div>
    )
}

export default MealPlanForm