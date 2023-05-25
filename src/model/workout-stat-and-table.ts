import { SetStateAction } from "react";
import { WorkoutRecord } from "./workout-form";

export type Props = {
  setEditMode: React.Dispatch<SetStateAction<boolean>>;
  setShowWorkoutForm: React.Dispatch<SetStateAction<boolean>>;
  setRecordId: React.Dispatch<SetStateAction<string>>;
  setEditableRecord: React.Dispatch<SetStateAction<WorkoutRecord & {id: string} | null>>;
  startDate: string;
  endDate: string;
  setFilterDates: React.Dispatch<React.SetStateAction<{
    startDate: string;
    endDate: string;
  }>>
}


