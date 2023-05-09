import { DocumentData, DocumentReference, DocumentSnapshot, Query, QuerySnapshot } from 'firebase/firestore';
import { getDocumentsAPI, addToMealplanAPI, logOutAPI, listenDocAPI, resetMealsAPI, getMealplansCountAPI, 
    createMealplanAPI, listenDocsAPI, toggleActiveMealplanAPI, registerUserWithEmailAndPasswordAPI, 
    loginWithEmailAndPasswordAPI, addSleepRecordAPI, addWorkoutRecordAPI, editWorkoutRecordAPI } from './api.service';
import { MealDataType } from '../model/add-to-meal-plan-modal';
import { MealDay } from '../model/meal-plan-details';
import { SleepData } from '../model/sleep-record-form';
import { FormData } from '../model/workout-form';

export const getDocuments = async(query: Query<DocumentData>) => getDocumentsAPI(query);

export const addToMealplan = async(recipeId: string, values: MealDataType) => addToMealplanAPI(recipeId, values);

export const logOut = async() => logOutAPI();

export const listenDoc = (
    reference: DocumentReference<DocumentData>, 
    callback: (snapshot: DocumentSnapshot<DocumentData>
) => void) => listenDocAPI(reference, callback);

export const resetMeals = (mealplanID: string, mealday: MealDay) => resetMealsAPI(mealplanID, mealday);

export const getMealplansCount = async() => getMealplansCountAPI();

export const createMealplan = async(
    mealplanName: string, userId: string, mealplanCount: number
) => createMealplanAPI(mealplanName, userId, mealplanCount);

export const listenDocs = (
    query: Query<DocumentData>, callback: (snapshot: QuerySnapshot<DocumentData>
) => void) => listenDocsAPI(query, callback);

export const toggleActiveMealplan = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
    isActiveMealPlan=false, 
    mealplanID: string, activeMealplanRef: React.MutableRefObject<string | null>
) => toggleActiveMealplanAPI(event, isActiveMealPlan, mealplanID, activeMealplanRef);

export const registerUserWithEmailAndPassword = async(
    email: string, password: string
) => registerUserWithEmailAndPasswordAPI(email, password);

export const loginWithEmailAndPassword = async(
    email: string, password: string
) => loginWithEmailAndPasswordAPI(email, password);

export const addSleepRecord = async(userId: string, values: SleepData) => addSleepRecordAPI(userId, values);

export const addWorkoutRecord = async(userId: string, values: FormData) => addWorkoutRecordAPI(userId, values);

export const editWorkoutRecord = async(recordId: string, values: FormData) => editWorkoutRecordAPI(recordId, values);