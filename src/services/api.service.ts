import { DocumentData, DocumentReference, DocumentSnapshot, Query, QuerySnapshot, addDoc, collection, doc, getCountFromServer, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, database } from "../firebaseClient";
import { MealDataType } from "../model/add-to-meal-plan-modal";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { MealDay } from "../model/meal-plan-details";
import { SleepData } from "../model/sleep-record-form";
import { FormData } from "../model/workout-form";

export const fetchDocuments = async(query: Query<DocumentData>) => {
    const querySnapshot = await getDocs(query);
    return querySnapshot.docs;
}

export const addRecipeToMealPlan = async(recipeId: string, values: MealDataType) => {
    const { meal, mealDay, mealPlan } = values;
    updateDoc(doc(database, 'mealplans', mealPlan?.id), {
        [`${mealDay}.${meal}`]: recipeId, 
    })
}

export const logoutUser = async() => {
    signOut(auth);
}

export const listenToDoc = (reference: DocumentReference<DocumentData>, 
    callback: (snapshot: DocumentSnapshot<DocumentData>) => void) => {
    return onSnapshot(reference, callback);
}

export const listenToDocs_ = (query: Query<DocumentData>, callback: (snapshot: QuerySnapshot<DocumentData>) => void) => {
    return onSnapshot(query, callback);
}

export const resetMealday = (mealplanID: string, mealday: MealDay) => {
    updateDoc(doc(database, 'mealplans', mealplanID), {
        [mealday]: {
            breakfast: '',
            lunch: '',
            dinner: '',
        }
    })
}

export const getMealplansCount_ = async() => {
    return (await getCountFromServer(collection(database, 'mealplans'))).data().count;
}

export const createMealplan_ = async(mealplanName: string, userId: string, mealplanCount: number) => {
    return addDoc(collection(database, 'mealplans'), {
        name: mealplanName,
        userId: userId,
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
}

export const toggleActiveMealplan_ = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
    isActiveMealPlan=false, 
    mealplanID: string, activeMealplanRef: React.MutableRefObject<string | null>
) => {
    event.stopPropagation();
    if(isActiveMealPlan) return;

    if(activeMealplanRef.current) {
        updateDoc(doc(database, 'mealplans', activeMealplanRef.current as string), {
            active: false,
        }); 
    }
    updateDoc(doc(database, 'mealplans', mealplanID), {
        active: true,
    });
}

export const registerUserWithEmailAndPassword_ = async(email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
}

export const loginWithEmailAndPassword_ = async(email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const addSleepRecord_ = async(userId: string, values: SleepData) => {
    const { date, sleepTime, sleepQuality } = values;

    addDoc(collection(database, 'sleeprecords'), {
        date: date,
        sleepTime: parseFloat(sleepTime),
        sleepQuality: sleepQuality,
        userId: userId,
    })
}

export const addWorkoutRecord_ = async(userId: string, values: FormData) => {
    const { caloriesBurned, distanceCovered, date, timeSpent } = values;

    addDoc(collection(database, 'workout'), {
        date: date,
        timeSpent: parseFloat(timeSpent),
        caloriesBurned: isNaN(parseFloat(caloriesBurned as string)) ? 0 : parseFloat(caloriesBurned as string),
        distanceCovered: isNaN(parseFloat(distanceCovered as string)) ? 0 : parseFloat(distanceCovered as string),
        userId: userId,
    });
}

export const editWorkoutRecord_ = async(recordId: string, values: FormData) => {
    const { caloriesBurned, distanceCovered, date, timeSpent } = values;

    updateDoc(doc(database, 'workout', recordId), {
        date: date,
        timeSpent: parseFloat(timeSpent),
        caloriesBurned: isNaN(parseFloat(caloriesBurned as string)) ? 0 : parseFloat(caloriesBurned as string),
        distanceCovered: isNaN(parseFloat(distanceCovered as string)) ? 0 : parseFloat(distanceCovered as string),
    });
}
