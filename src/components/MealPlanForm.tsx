import { addDoc, collection } from "firebase/firestore";
import { FormEvent, useRef, useState, SetStateAction } from 'react';
import { database } from "../firebaseClient";
import { useAuthValue } from "../utils/authContext";
import { useNotification } from "../utils/notificationContext";

type Props = {
    setAddMealPlan: React.Dispatch<SetStateAction<boolean>>
}

const MealPlanForm = ({ setAddMealPlan }: Props) => {
    const mealPlanNameRef = useRef<HTMLInputElement | null>(null);
    const [creatingPlan, setCreatingPlan] = useState(false);
    const user = useAuthValue();
    const setNotification = useNotification()?.setNotification;

    const createMealPlan = async(event: FormEvent) => {
        event.preventDefault();

        if(mealPlanNameRef.current && mealPlanNameRef.current.value.trim() && user) {
            setCreatingPlan(true);

            try {
                await addDoc(collection(database, 'mealplans'), {
                    name: mealPlanNameRef.current.value,
                    userId: user.uid,
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
                console.log(err.code);
            }
            setCreatingPlan(false);
            setNotification && setNotification('Meal plan added successfully. Now you can start adding recipes to your meal plan.');
            setAddMealPlan(false);
        }
    }

    return (
        <div className="fixed top-0 right-0 left-0 bottom-0 flex items-center justify-center bg-black/30 z-30 py-5"
            onClick={() => setAddMealPlan(false)}>
            <div className="max-h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={createMealPlan}
                    className="bg-white flex flex-col items-center rounded-md shadow-md px-8 py-4">
                    <h2 className="font-bold">Create Meal Plan</h2>
                    <p className="text-sm text-gray-500 mb-3">Give a descriptive name for your meal plan</p>
                    <input 
                        type="text"
                        ref={mealPlanNameRef}
                        aria-label="meal plan name"
                        placeholder="Meal plan name"
                        className="input-style mb-3" />
                    <div>
                        <button type='submit'
                            className="w-[80px] bg-theme text-white mr-2 rounded-[4px] text-sm font-medium py-2
                            hover:bg-themeHover transition-all">{ creatingPlan ? '. . .' : 'Create'}</button>
                        <button type="button"
                            className="w-[80px] border border-mainBorder ml-2 rounded-[4px] text-sm font-medium py-2
                            hover:bg-gray-100 transition-all"
                            onClick={() => setAddMealPlan(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MealPlanForm