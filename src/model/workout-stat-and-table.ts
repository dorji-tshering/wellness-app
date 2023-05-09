import { SetStateAction } from "react";

export type Props = {
    setEditMode: React.Dispatch<SetStateAction<boolean>>;
    setShowWorkoutForm: React.Dispatch<SetStateAction<boolean>>;
    setRecordId: React.Dispatch<SetStateAction<string>>;
    setEditableRecord: React.Dispatch<SetStateAction<WorkoutRecord | null>>;
}

export type WorkoutRecord = WorkoutStats & {
    id: string,
    date: string
}

export type WorkoutStats = {
    timeSpent: number;
    caloriesBurned: number;
    distanceCovered: number;
}