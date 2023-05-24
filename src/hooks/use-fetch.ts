import { useAppDispatch } from "../state/hooks";
import { fetchSleepRecords } from "../state/sleep-record/sleep-record.slice";
import { fetchMealplans } from "../state/mealplans/mealplans.slice";
import { fetchWorkoutStats } from "../state/workout-stats/workout-stat.slice";
import { CurrentUser, FetchType, Status } from "../model/use-fetch-hook";
import { useEffect } from "react";

export const useFetch = (fetchType: FetchType, user: CurrentUser, status: Status ) => {
  const dispatch = useAppDispatch();

  // avoid "cannot update a component while rendering a different component" via useEffect
  useEffect(() => {
    if(user && status === 'idle') {
      if(fetchType === 'nutrientStats') {
        dispatch(fetchMealplans(user.uid)); 
      }else if(fetchType === 'sleepStats') {
        dispatch(fetchSleepRecords(user.uid));
      }else if(fetchType === 'workoutStats') {
        dispatch(fetchWorkoutStats(user.uid));
      }
    }
  });
}