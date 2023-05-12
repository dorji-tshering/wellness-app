import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WorkoutStats, WorkoutRecord } from '../../model/workout-stat-and-table';
import { RootState } from '../store';
import { getDocuments } from '../../services/facade.service';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { database } from '../../firebaseClient';
import { resetAll } from '../hooks';

interface InitialState {
    stats: WorkoutStats
    records: Array<WorkoutRecord>
    status: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: InitialState = {
    stats: {
        timeSpent: 0,
        caloriesBurned: 0,
        distanceCovered: 0,
    },
    records: [],
    status: 'idle',
} 

export const fetchWorkoutStats = createAsyncThunk(
    'workoutStats/fetchStats',
    async(userId: string) => {
        const q = query(collection(database, 'workout'), where('userId', '==', userId), orderBy('date', 'desc'));
        const docs = await getDocuments(q);
        const records: Array<WorkoutRecord> = [];
        let timeSpent = 0;
        let caloriesBurned = 0;
        let distanceCovered = 0;

        docs.forEach((record) => {
            timeSpent += record.data().timeSpent;
            caloriesBurned += record.data().caloriesBurned;
            distanceCovered += record.data().distanceCovered;

            records.push({
                id: record.id,
                date: record.data().date,
                timeSpent: record.data().timeSpent,
                caloriesBurned: record.data().caloriesBurned,
                distanceCovered: record.data().distanceCovered,
            });
        })

        return {
            stats: {
                timeSpent,
                caloriesBurned,
                distanceCovered,
            },
            records,
        }
    }
)

const workoutStatSlice = createSlice({
    name: 'workoutStats',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchWorkoutStats.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(fetchWorkoutStats.fulfilled, (state, action) => {
            state.stats = action.payload.stats;
            state.records = action.payload.records;
            state.status = 'succeeded';
        })
        .addCase(fetchWorkoutStats.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(resetAll, () => initialState)
    }
}); 

export const selectWorkoutStats = (state: RootState) => state.workout.stats; 
export const selectStatus = (state: RootState) => state.workout.status; 
export const selectRecords = (state: RootState) => state.workout.records;

export default workoutStatSlice.reducer;