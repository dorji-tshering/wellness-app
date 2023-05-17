import { useAppDispatch } from "../state/hooks";
import { fetchSleepRecords } from "../state/sleep-record/sleep-record.slice";
import { fetchMealplans } from "../state/mealplans/mealplans.slice";
import { fetchWorkoutStats } from "../state/workout-stats/workout-stat.slice";
import { CurrentUser, FetchType, Status } from "../model/use-fetch-hook";

export const useFetch = (fetchType: FetchType, user: CurrentUser, status: Status ) => {
  const dispatch = useAppDispatch();

  if(user && status === 'idle') {
      if(fetchType === 'nutrientStats') {
        dispatch(fetchMealplans(user.uid));
      }else if(fetchType === 'sleepStats') {
        dispatch(fetchSleepRecords(user.uid));
      }else if(fetchType === 'workoutStats') {
        dispatch(fetchWorkoutStats(user.uid));
      }
  }
}