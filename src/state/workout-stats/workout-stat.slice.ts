import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WorkoutRecord } from '../../model/workout-form';
import { RootState } from '../store';
import { getDocuments } from '../../services/facade.service';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { database } from '../../firebaseClient';
import { resetAll } from '../hooks';

interface InitialState {
    records: Array<WorkoutRecord & {id: string}>
    status: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState: InitialState = {
    records: [],
    status: 'idle',
} 

export const fetchWorkoutRecords = createAsyncThunk(
    'workoutRecord/fetch',
    async(userId: string) => {
        const q = query(collection(database, 'workout'), where('userId', '==', userId), orderBy('date', 'desc'));
        const docs = await getDocuments(q);
        const records: Array<WorkoutRecord & {id: string}> = [];
        docs.forEach(doc => {
          records.push({
            id: doc.id,
            date: doc.data().date,
            workoutIDs: doc.data().workoutIDs,
            workouts: doc.data().workouts,
          });
        });
        return {
          records
        }
    }
)

const workoutRecordSlice = createSlice({
    name: 'workoutRecords',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchWorkoutRecords.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(fetchWorkoutRecords.fulfilled, (state, action) => {
            state.records = action.payload.records;
            state.status = 'succeeded';
        })
        .addCase(fetchWorkoutRecords.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(resetAll, () => initialState)
    }
}); 
 
export const selectStatus = (state: RootState) => state.workout.status; 
export const selectRecords = (state: RootState) => state.workout.records;

export default workoutRecordSlice.reducer;