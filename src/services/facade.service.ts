import { DocumentData, DocumentReference, DocumentSnapshot, Query, QuerySnapshot } from 'firebase/firestore';
import { fetchDocuments, addRecipeToMealPlan, logoutUser, listenToDoc, resetMealday, getMealplansCount_, 
    createMealplan_, listenToDocs_, toggleActiveMealplan_, registerUserWithEmailAndPassword_, 
    loginWithEmailAndPassword_, addSleepRecord_, addWorkoutRecord_, editWorkoutRecord_ } from './api.service';
import { MealDataType } from '../model/add-to-meal-plan-modal';
import { MealDay } from '../model/meal-plan-details';
import { SleepData } from '../model/sleep-record-form';
import { FormData } from '../model/workout-form';

export const getDocuments = async(query: Query<DocumentData>) => fetchDocuments(query);

export const addToMealplan = async(recipeId: string, values: MealDataType) => addRecipeToMealPlan(recipeId, values);

export const logOut = async() => logoutUser();

export const listenDoc = (
    reference: DocumentReference<DocumentData>, 
    callback: (snapshot: DocumentSnapshot<DocumentData>
) => void) => listenToDoc(reference, callback);

export const resetMeals = (mealplanID: string, mealday: MealDay) => resetMealday(mealplanID, mealday);

export const getMealplansCount = async() => getMealplansCount_();

export const createMealplan = async(
    mealplanName: string, userId: string, mealplanCount: number
) => createMealplan_(mealplanName, userId, mealplanCount);

export const listenToDocs = (
    query: Query<DocumentData>, callback: (snapshot: QuerySnapshot<DocumentData>
) => void) => listenToDocs_(query, callback);

export const toggleActiveMealplan = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
    isActiveMealPlan=false, 
    mealplanID: string, activeMealplanRef: React.MutableRefObject<string | null>
) => toggleActiveMealplan_(event, isActiveMealPlan, mealplanID, activeMealplanRef);

export const registerUserWithEmailAndPassword = async(
    email: string, password: string
) => registerUserWithEmailAndPassword_(email, password);

export const loginWithEmailAndPassword = async(
    email: string, password: string
) => loginWithEmailAndPassword_(email, password);

export const addSleepRecord = async(userId: string, values: SleepData) => addSleepRecord_(userId, values);

export const addWorkoutRecord = async(userId: string, values: FormData) => addWorkoutRecord_(userId, values);

export const editWorkoutRecord = async(recordId: string, values: FormData) => editWorkoutRecord_(recordId, values);