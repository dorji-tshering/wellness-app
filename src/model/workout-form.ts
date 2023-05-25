export interface WorkoutRecord {
    date: string;
    workoutIDs: string[];
    workouts: {
      workoutId: string
      workoutName: string
      timeSpent: string
      distanceCovered?: string
    }[]
}

export type Props = {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
    setRecordId: React.Dispatch<React.SetStateAction<string>>
    setEditableRecord: React.Dispatch<React.SetStateAction<WorkoutRecord & {id: string} | null>>
    editing: boolean
    recordId?: string
    editableRecord: WorkoutRecord & {id: string} | null
}