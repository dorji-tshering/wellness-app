import { configureStore } from "@reduxjs/toolkit";
import workoutReducer from './workout-stats/workout-stat.slice';
import mealplanReducer from './mealplans/mealplans.slice';
import sleepRecordReducer from './sleep-record/sleep-record.slice';

export const store = configureStore({
    reducer: {
        workoutStats: workoutReducer,
        mealplans: mealplanReducer,
        sleepRecord: sleepRecordReducer,
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;