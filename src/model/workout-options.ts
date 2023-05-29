import { WorkoutRecord } from "./workout-form"

export interface Props {
  setShowWorkoutOptions: React.Dispatch<React.SetStateAction<boolean>>
  values: WorkoutRecord
}