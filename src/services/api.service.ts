import { DocumentData, DocumentReference, DocumentSnapshot, Query, QuerySnapshot, addDoc, collection, doc, getCountFromServer, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { auth, database } from "../firebaseClient";
import { MealDataType } from "../model/add-to-meal-plan-modal";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { MealDay } from "../model/meal-plan-details";
import { SleepData } from "../model/sleep-record-form";
import { FormData } from "../model/workout-form";

export const getDocumentsAPI = async(query: Query<DocumentData>) => {
    const querySnapshot = await getDocs(query);
    return querySnapshot.docs;
}

export const addToMealplanAPI = async(recipeId: string, values: MealDataType) => {
    const { meal, mealDay, mealPlan } = values;
    mealPlan && updateDoc(doc(database, 'mealplans', mealPlan?.id), {
        [`${mealDay}.${meal}`]: recipeId,
    })
}

export const logOutAPI = async() => {
    signOut(auth);
}

export const listenDocAPI = (reference: DocumentReference<DocumentData>, 
    callback: (snapshot: DocumentSnapshot<DocumentData>) => void) => {
    return onSnapshot(reference, callback);
}

export const listenDocsAPI = (query: Query<DocumentData>, callback: (snapshot: QuerySnapshot<DocumentData>) => void) => {
    return onSnapshot(query, callback);
}

export const resetMealsAPI = async (mealplanID: string, mealday: MealDay) => {
    updateDoc(doc(database, 'mealplans', mealplanID), {
        [mealday]: {
            breakfast: '',
            lunch: '',
            dinner: '',
        }
    })
}

export const getMealplansCountAPI = async(userId: string) => {
    const q = query(collection(database, 'mealplans'), where('userId', '==', userId))
    return (await getCountFromServer(q)).data().count;
}

export const createMealplanAPI = async(mealplanName: string, userId: string, mealplanCount: number) => {
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

export const toggleActiveMealplanAPI = async(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
    mealplanID: string, activeMealplanRef: React.MutableRefObject<string | null>
) => {
    event.stopPropagation();

    if(activeMealplanRef.current) {
        updateDoc(doc(database, 'mealplans', activeMealplanRef.current as string), {
            active: false,
        }); 
    }
    updateDoc(doc(database, 'mealplans', mealplanID), {
        active: true,
    });
}

export const registerUserWithEmailAndPasswordAPI = async(email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
}

export const loginWithEmailAndPasswordAPI = async(email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const addSleepRecordAPI = async(userId: string, values: SleepData) => {
    const { date, sleepTime, sleepQuality } = values;

    addDoc(collection(database, 'sleeprecords'), {
        date: date,
        sleepTime: parseFloat(sleepTime),
        sleepQuality: sleepQuality,
        userId: userId,
    })
}

export const addWorkoutRecordAPI = async(userId: string, values: FormData) => {
    // //const { workoutIDs, runDistance, cyclingDistance, walkDistance, date, timeSpent } = values;

    // addDoc(collection(database, 'workout'), {
    //     date: date,
    //     timeSpent: parseFloat(timeSpent),
    //     workoutIDs: workoutIDs,
    //     userId: userId,
    // });
}

export const editWorkoutRecordAPI = async(recordId: string, values: FormData) => {
    // const { workoutIDs, runDistance, walkDistance, cyclingDistance, date, timeSpent } = values;

    // updateDoc(doc(database, 'workout', recordId), {
    //     date: date,
    //     timeSpent: parseFloat(timeSpent),
    //     workoutIDs: workoutIDs,
    //     //distanceCovered: isNaN(parseFloat(distanceCovered as string)) ? 0 : parseFloat(distanceCovered as string),
    // });
}
