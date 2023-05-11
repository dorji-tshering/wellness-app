import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SleepData } from '../../model/sleep-record-form';
import { collection, query, where } from "firebase/firestore";
import { database } from "../../firebaseClient";
import { addSleepRecord, getDocuments } from "../../services/facade.service";
import { RootState } from "../store";
import { resetAll } from "../hooks";

interface InitialState {
    sleepRecords: Array<Omit<SleepData, 'sleepTime'> & { sleepTime: number }>
    filteredRecords: Array<Omit<SleepData, 'sleepTime'> & { sleepTime: number }>
    fetchStatus: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
    sleepRecords: [],
    filteredRecords: [],
    fetchStatus: 'idle',
} as InitialState;

export const fetchSleepRecords = createAsyncThunk(
    'sleepRecord/fetch',
    async(userId: string) => {
        const q = query(collection(database, 'sleeprecords'), where('userId', '==', userId));
        const records: Array<Omit<SleepData, 'sleepTime'> & { sleepTime: number }> = [];
        const docs = await getDocuments(q);
        docs.forEach(doc => {
            records.push({
                date: doc.data().date,  
                sleepTime: doc.data().sleepTime,
                sleepQuality: doc.data().sleepQuality,
            });
        });

        return {
            sleepRecords: records,
        }
    }
);

export const addASleepRecord = createAsyncThunk(
    'sleepRecord/add',
    async(arg: { userId: string, values: SleepData}) => {
        await addSleepRecord(arg.userId, arg.values);

        return {
            sleepData: {
                ...arg.values,
                sleepTime: Number(arg.values.sleepTime),
            },
        }
    }
);

const sleepRecordSlice = createSlice({
    name: 'sleepRecord',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchSleepRecords.pending, (state) => {
            state.fetchStatus = 'pending';
        })
        .addCase(fetchSleepRecords.fulfilled, (state, action) => {
            state.sleepRecords = action.payload.sleepRecords;
            state.fetchStatus = 'succeeded';
        })
        .addCase(fetchSleepRecords.rejected, (state) => {
            state.fetchStatus = 'failed';
        })
        .addCase(addASleepRecord.fulfilled, (state, action) => {
            state.sleepRecords.push(action.payload.sleepData);
        })
        .addCase(resetAll, () => initialState)
    }
});

export const selectSleepRecords = (state: RootState) => state.sleepRecord.sleepRecords;
export const selectStatus = (state: RootState) => state.sleepRecord.fetchStatus;
export default sleepRecordSlice.reducer;