import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, deleteDoc, doc, query, where } from 'firebase/firestore';
import { database } from '../../firebaseClient';
import { addToMealplan, createMealplan, getDocuments, resetMeals, toggleActiveMealplan } from '../../services/facade.service';
import { RootState } from '../store';
import { MealPlan } from '../../model/mealplans';
import { MealDataType, MealDay } from '../../model/add-to-meal-plan-modal';
import { resetAll } from '../hooks';

interface InitialState {
    mealplans: Array<MealPlan>
    fetchStatus: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
    mealplans: [],
    fetchStatus: 'idle',
} as InitialState;

export const fetchMealplans = createAsyncThunk(
    'mealplans/fetchMealplans',
    async(userId: string) => {
        const q = query(collection(database, 'mealplans'), where('userId', '==', userId));
        const docs = await getDocuments(q);
        let mealplans: InitialState['mealplans'] = [];

        docs.forEach(doc => {
            mealplans.push({
                id: doc.id,
                name: doc.data().name,
                active: doc.data().active,
                dayOne: {
                    breakfast: doc.data().dayOne.breakfast,
                    lunch: doc.data().dayOne.lunch,
                    dinner: doc.data().dayOne.dinner,
                },
                dayTwo: {
                    breakfast: doc.data().dayTwo.breakfast,
                    lunch: doc.data().dayTwo.lunch,
                    dinner: doc.data().dayTwo.dinner,
                },
                dayThree: {
                    breakfast: doc.data().dayThree.breakfast,
                    lunch: doc.data().dayThree.lunch,
                    dinner: doc.data().dayThree.dinner,
                },
                dayFour: {
                    breakfast: doc.data().dayFour.breakfast,
                    lunch: doc.data().dayFour.lunch,
                    dinner: doc.data().dayFour.dinner,
                },
                dayFive: {
                    breakfast: doc.data().dayFive.breakfast,
                    lunch: doc.data().dayFive.lunch,
                    dinner: doc.data().dayFive.dinner,
                },
                daySix: {
                    breakfast: doc.data().daySix.breakfast,
                    lunch: doc.data().daySix.lunch,
                    dinner: doc.data().daySix.dinner,
                },
                daySeven: {
                    breakfast: doc.data().daySeven.breakfast,
                    lunch: doc.data().daySeven.lunch,
                    dinner: doc.data().daySeven.dinner,
                }
            })
        });

        return {
            mealplans
        }
    }
);

export const toggleActivePlan = createAsyncThunk(
    'mealplans/toggleActivePlan',
    async(arg: {
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
        isActiveMealPlan: boolean | undefined, 
        mealplanID: string, 
        activeMealplanRef: React.MutableRefObject<string | null>,
    }) => {
        !arg.isActiveMealPlan && await toggleActiveMealplan(arg.event, arg.mealplanID, arg.activeMealplanRef);
        
        if(arg.isActiveMealPlan) {
            return null;
        }else {
            return {
                activePlanId: arg.mealplanID,
                prevActivePlanId: arg.activeMealplanRef.current,
            }
        }
    }
);

export const deleteMealplan = createAsyncThunk(
    'mealplans/delete',
    async(planId: string) => {
        await deleteDoc(doc(database, 'mealplans', planId));
        return {
            deletedPlanId: planId,
        }
    }
);

export const addMealplan = createAsyncThunk(
    'mealplans/add',
    async(arg: {
        mealplanName: string,
        userId: string,
        mealplansCount: number,
    }) => {
        const mealplanRef = await createMealplan(arg.mealplanName, arg.userId, arg.mealplansCount);
        return {
            addedPlan: {
                id: mealplanRef.id,
                name: arg.mealplanName,
                active: arg.mealplansCount > 0 ? false : true,
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
            }
        }
    }
);

export const addRecipeToMealplan = createAsyncThunk(
    'mealplans/addRecipeToPlan',
    async(arg: {
        recipeId: string,
        values: MealDataType
    }) => {
        await addToMealplan(arg.recipeId, arg.values);
        return {
            recipeId: arg.recipeId,
            values: arg.values,
        }
    }
);

export const resetAMeal = createAsyncThunk(
    'mealplans/resetMeal',
    async(arg: {
        mealplanId: string,
        mealday: MealDay,
    }) => {
        await resetMeals(arg.mealplanId, arg.mealday);
        return {
            mealplanId: arg.mealplanId,
            mealday: arg.mealday,
        }
    }
);

const mealplansSlice = createSlice({
    name: 'mealplans',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchMealplans.pending, (state) => {
            state.fetchStatus = 'pending';
        })
        .addCase(fetchMealplans.fulfilled, (state, action) => {
            state.mealplans = action.payload.mealplans;
            state.fetchStatus = 'succeeded';
        })
        .addCase(fetchMealplans.rejected, (state) => {
            state.fetchStatus = 'failed';
        })
        .addCase(toggleActivePlan.fulfilled, (state, action) => {
            if(action.payload) {
                const activePlanIndex = state.mealplans.map(plan => plan.id).indexOf(action.payload.activePlanId);
                state.mealplans[activePlanIndex].active = true;
                if(action.payload.prevActivePlanId) {
                    const prevActiveplanIndex = state.mealplans.map(plan => plan.id).indexOf(action.payload.prevActivePlanId);
                    state.mealplans[prevActiveplanIndex].active = false;
                }
            }
        })
        .addCase(deleteMealplan.fulfilled, (state, action) => {
            state.mealplans = state.mealplans.filter(plan => plan.id !== action.payload.deletedPlanId);
        })
        .addCase(addMealplan.fulfilled, (state, action) => {
            state.mealplans.push(action.payload.addedPlan);
        }) 
        .addCase(addRecipeToMealplan.fulfilled, (state, action) => {
            const mealData = action.payload.values;
            const mealplanIndex = state.mealplans.map(plan => plan.id).indexOf(mealData.mealPlan?.id as string);
            if(mealData.meal && mealData.mealDay) {
                state.mealplans[mealplanIndex][mealData.mealDay][mealData.meal] = action.payload.recipeId;
            }
        })
        .addCase(resetAMeal.fulfilled, (state, action) => {
            const mealplanIndex = state.mealplans.map(plan => plan.id).indexOf(action.payload.mealplanId);
            state.mealplans[mealplanIndex][action.payload.mealday] = {
                breakfast: '',
                lunch: '',
                dinner: '',
            }
        })
        .addCase(resetAll, () => initialState)
    }
});

export const selectMealplans = (state: RootState) => state.mealplans.mealplans;
export const selectFetchStatus = (state: RootState) => state.mealplans.fetchStatus;

export default mealplansSlice.reducer;