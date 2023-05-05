import { DocumentData } from "firebase/firestore";
import { SetStateAction } from "react";

export type Props = {
    setEditMode: React.Dispatch<SetStateAction<boolean>>;
    setShowWorkoutForm: React.Dispatch<SetStateAction<boolean>>;
    setRecordId: React.Dispatch<SetStateAction<string>>;
    setEditableRecord: React.Dispatch<SetStateAction<DocumentData>>;
}

export type WorkoutStats = {
    timeSpent: number;
    caloriesBurned: number;
    distanceCovered: number;
}