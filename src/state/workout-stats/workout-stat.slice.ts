import { createSlice, createAsyncThunk, PayloadAction, createEntityAdapter, EntityId, Dictionary } from '@reduxjs/toolkit';
import { WorkoutRecord } from '../../model/workout-form';
import { RootState } from '../store';
import { getDocuments } from '../../services/facade.service';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { database } from '../../firebaseClient';
import { resetAll } from '../hooks';

interface InitialState {
    ids: EntityId[]
    entities: Dictionary<WorkoutRecord & {id: string}>
    status: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const workoutAdapter = createEntityAdapter<WorkoutRecord & {id: string}>({
  selectId: (record) => record.id
});

const initialState: InitialState = {
  ids: [],
  entities: {},
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
        workoutAdapter.addOne(state, {
          id: action.payload.recordId,
          ...action.payload.newRecord,
        });
      },
      deleteWorkoutRecord(state, action: PayloadAction<{recordId: string}>) {
        workoutAdapter.removeOne(state, action.payload.recordId);
      },
      updateWorkoutRecord(state, action: PayloadAction<{
        recordId: string;
        updatedRecord: WorkoutRecord;
      }>) {
        workoutAdapter.updateOne(state, {
          id: action.payload.recordId,
          changes: {
            ...action.payload.updatedRecord
          }
        });
      }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchWorkoutRecords.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(fetchWorkoutRecords.fulfilled, (state, action) => {
            workoutAdapter.setAll(state, action.payload.records);
            state.status = 'succeeded';
        })
        .addCase(fetchWorkoutRecords.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(resetAll, () => initialState)
    }
}); 

const workoutSelectors = workoutAdapter.getSelectors((state: RootState) => state.workout);

export const selectStatus = (state: RootState) => state.workout.status; 
export const selectRecords = workoutSelectors.selectAll;
export const { updateWorkoutRecord, addWorkoutRecord, deleteWorkoutRecord } = workoutRecordSlice.actions;

export default workoutRecordSlice.reducer;