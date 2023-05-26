import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SleepData } from '../../model/sleep-record-form';
import { collection, query, where } from "firebase/firestore";
import { database } from "../../firebaseClient";
import { addSleepRecord, getDocuments } from "../../services/facade.service";
import { RootState } from "../store";
import { resetAll } from "../hooks";

interface InitialState {
    sleepRecords: Array<SleepData & {recordId: string}>
    fetchStatus: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
    sleepRecords: [],
    fetchStatus: 'idle',
} as InitialState;

export const fetchSleepRecords = createAsyncThunk(
    'sleepRecord/fetch',
    async(userId: string) => {
        const q = query(collection(database, 'sleeprecords'), where('userId', '==', userId));
        const records: Array<SleepData & { recordId: string }> = [];
        const docs = await getDocuments(q);
        docs.forEach(doc => {
          records.push({
            date: doc.data().date,
            recordId: doc.data().recordId,
            sleepTime: doc.data().sleepTime,
            wakeupTime: doc.data().wakeupTime,
            duration: doc.data().duration,
            quality: doc.data().quality,
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
        const recordId = await addSleepRecord(arg.userId, arg.values);
        return {
            recordId,
            ...arg.values
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
        .addCase(fetchSleepRecords.rejected, (state, action) => {
            state.fetchStatus = 'failed';
        })
        .addCase(addASleepRecord.fulfilled, (state, action) => {
            state.sleepRecords.push(action.payload);
        })
        .addCase(resetAll, () => initialState)
    }
});

export const selectSleepRecords = (state: RootState) => state.sleep.sleepRecords;
export const selectStatus = (state: RootState) => state.sleep.fetchStatus;
export default sleepRecordSlice.reducer;