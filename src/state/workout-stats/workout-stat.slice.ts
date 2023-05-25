import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
    reducers: {
      addWorkoutRecord(state, action: PayloadAction<{
        recordId: string;
        newRecord: WorkoutRecord;
      }>) {
        state.records.push({
          id: action.payload.recordId,
          ...action.payload.newRecord,
        });
      },
      deleteWorkoutRecord(state, action: PayloadAction<{recordId: string}>) {
        state.records = state.records.filter(record => record.id !== action.payload.recordId)
      },
      updateWorkoutRecord(state, action: PayloadAction<{
        recordId: string;
        updatedRecord: WorkoutRecord;
      }>) {
        const record = state.records.find(record => record.id === action.payload.recordId) as WorkoutRecord & {id: string};
        record.date = action.payload.updatedRecord.date;
        record.workoutIDs = action.payload.updatedRecord.workoutIDs;
        record.workouts = action.payload.updatedRecord.workouts;
      }
    },
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
export const { updateWorkoutRecord, addWorkoutRecord, deleteWorkoutRecord } = workoutRecordSlice.actions;

export default workoutRecordSlice.reducer;