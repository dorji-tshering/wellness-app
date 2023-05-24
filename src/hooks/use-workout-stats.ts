import { useMemo } from "react";
import { WorkoutRecord } from "../model/workout-form";
import { getWorkout } from "../utils/workout-options";

export const useWorkoutStat = (records: Array<WorkoutRecord & {id: string}>) => {
  const workoutStats = useMemo(() => {
    const timeSpent: {[key: string]: number} = {};
    const distanceCovered: {[key: string]: number} = {};
    const caloriesBurned: {[key: string]: number} = {};

    records.forEach(record => {
      record.workouts.forEach(workout => {
        timeSpent[workout.workoutId] = timeSpent[workout.workoutId] ? 
          timeSpent[workout.workoutId] + Number(workout.timeSpent) : Number(workout.timeSpent);
        distanceCovered[workout.workoutId] = distanceCovered[workout.workoutId] ?
          distanceCovered[workout.workoutId] + Number(workout.distanceCovered) : Number(workout.distanceCovered);
        // calculate calories burned
        const caloriePerThirty = getWorkout(workout.workoutId)?.caloPerThirtyMins as number;
        const totalCaloriesBurned = (Number(workout.timeSpent) / 30) * caloriePerThirty;
        caloriesBurned[workout.workoutId] = caloriesBurned[workout.workoutId] ? 
          caloriesBurned[workout.workoutId] + Number(totalCaloriesBurned.toFixed(0)) : Number(totalCaloriesBurned.toFixed(0)); 
      });
    });
    return {
      timeSpent,
      distanceCovered,
      caloriesBurned
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records]);
  return workoutStats;
}