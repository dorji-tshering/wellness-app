import { deleteDoc, doc } from "firebase/firestore";
import { memo, useState } from 'react';
import { database } from "../../firebaseClient";
import { useAuthValue } from "../../hooks/use-auth-context";
import Loader from "../loader/loader";
import { useNotification } from "../../hooks/use-notification-context";
import { MdHourglassEmpty } from 'react-icons/md';
import { Props } from "../../model/workout-stat-and-table";
import { deleteWorkoutRecord, selectRecords, selectStatus } from "../../state/workout-stats/workout-stat.slice";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { useFetch } from "../../hooks/use-fetch";
import { useWorkoutStat } from "../../hooks/use-workout-stats";
import WorkoutStats from "./workout-stat";
import { WorkoutRecord } from "../../model/workout-form";

const WorkoutStatAndTable= memo(({ 
  setEditMode, 
  setShowWorkoutForm, 
  setRecordId, 
  setEditableRecord }: Props
) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteRecordId, setDeleteRecordId] = useState('');
    const [deleting, setDeleting] = useState(false);
    const user = useAuthValue();
    const setNotification = useNotification()?.setNotification;
    const status = useAppSelector(selectStatus);
    useFetch('workoutStats', user, status);

    const records = useAppSelector(selectRecords);
    const sortedRecord = records.slice().sort((a, b) => {
      if(a.date < b.date) {
        return 1;
      }else return -1;
    });
    const workoutStats = useWorkoutStat(records);
    const dispatch = useAppDispatch();

    const deleteRecord = async() => {
        setDeleting(true);
        await deleteDoc(doc(database, 'workout', deleteRecordId));
        dispatch(deleteWorkoutRecord({
          recordId: deleteRecordId
        }));
        setNotification && setNotification('Record deleted successfully.');
        setDeleteRecordId('');
        setDeleting(false);
        setConfirmDelete(false);
    }

    const showEditForm = (recordId: string, record: WorkoutRecord & {id: string}) => {
        setEditMode(true);
        setShowWorkoutForm(true);
        setEditableRecord(record);
        setRecordId(recordId);
    }

    if(status === 'idle' || status === 'pending') {
        return (
            <div className="w-full relative h-[200px]">
                <Loader/>
            </div>
        )
    }

    return (
        <div>
            { confirmDelete && (
                <div className="fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center p-4
                bg-black/30 z-30"
                    onClick={() => setConfirmDelete(false)}>
                    <div className="bg-white rounded-md shadow-md py-5 px-8 flex flex-col justify-center items-center"
                        onClick={(e) => e.stopPropagation()}>
                        <p className="font-medium">Confirm Delete?</p>
                        <p className="mb-5 text-sm text-gray-500">You can't undo the action</p>
                        <div className="flex justify-center">
                          <button className="w-[70px] mr-3 text-gray-600 hover:bg-gray-200 rounded-[4px] py-2 text-sm font-medium"
                            onClick={() => setConfirmDelete(false)}>Cancel</button>
                          <button className="w-[70px] text-white mr-2 bg-red-600 rounded-[4px] py-2 text-sm font-medium" 
                            onClick={deleteRecord}>{ deleting ? '. . .' : 'Delete' }</button>
                        </div>
                    </div>
                </div>
            ) }

            { !!records.length ? (
                    <>
                        <p className="mt-3 mb-5 text-center">Maintain your workout records here and stay fit!</p>
                        {/* workout record table */}
                        <div className="mx-auto xl:max-w-[80%] flex flex-col border border-mainBorder rounded-md">
                            <div className="hidden sm:grid sm:grid-cols-5 border-b border-b-mainBorder bg-gray-100 
                                rounded-tr-md rounded-tl-md">
                                <span className="workout-table-head">Date</span>
                                <div className="col-span-3 grid grid-cols-3">
                                  <span className="workout-table-head">Workouts</span>
                                  <span className="workout-table-head">Time <span className="text-xs text-gray-500 pl-[2px]">(min)</span></span>
                                  <span className="workout-table-head">Distance <span className="text-xs text-gray-500 pl-[2px]">(m)</span></span>
                                </div>
                                <span className="px-3 py-2 font-medium">Actions</span>
                            </div>
                            { sortedRecord.map((record, idx) => (
                                <div 
                                    key={idx}
                                    className="flex flex-col sm:grid sm:grid-cols-5 border-b border-b-black 
                                    sm:border-b-mainBorder last:border-b-0 text-sm text-gray-600
                                    ">
                                    <div className="workout-table-cell flex justify-between">
                                        <span className="sm:hidden font-medium">Date</span>
                                        <span className="whitespace-nowrap text-gray-500 sm:text-inherit">{record.date}</span>
                                    </div>
                                    <div className="flex sm:block sm:col-span-3">
                                      <div className="grid grid-rows-3 sm:hidden font-medium">
                                        <span className="px-3 py-2 border-b border-r border-mainBorder">
                                          Workouts
                                        </span>
                                        <span className="px-3 py-2 border-b border-r border-mainBorder">
                                          Time <span className="text-xs text-gray-500 pl-[2px]">(min)</span>
                                        </span>
                                        <span className="px-3 py-2 border-b border-r border-mainBorder">
                                          Distance <span className="text-xs text-gray-500 pl-[2px]">(m)</span>
                                        </span>
                                      </div>
                                      { record.workouts.map(( workout, idx) => (
                                        <div className="sm:border-b last:border-b-0 border-mainBorder grid grid-rows-3 auto-cols-fr
                                          sm:grid-rows-none sm:grid-cols-3 grow border-r last:border-r-0 sm:border-r-0"
                                          key={idx}>
                                          <div className="workout-table-cell">
                                            <span className="text-gray-500 sm:text-inherit">{ workout.workoutName }</span>
                                          </div>
                                          <div className="workout-table-cell">
                                            <span className="text-gray-500 sm:text-inherit">{ workout.timeSpent }</span>
                                          </div>
                                          <div className="workout-table-cell">
                                            <span className="text-gray-500 sm:text-inherit">
                                              { workout.distanceCovered ?? '--'}
                                            </span>
                                          </div>
                                        </div>
                                      )) }
                                    </div>
                                    <div className="flex justify-between py-2 sm:py-2 px-3 font-medium">
                                        <button 
                                            className="w-[80px] sm:w-auto rounded-[4px] bg-theme/5 sm:bg-transparent
                                            py-2 sm:py-0 text-theme text-sm sm:hover:underline h-min"
                                            onClick={() => showEditForm(record.id, record)}>Edit</button>
                                        <button 
                                            className="w-[80px] sm:w-auto rounded-[4px] bg-red-100 sm:bg-transparent
                                            py-2 sm:py-0 text-red-600 text-sm sm:hover:underline h-min"
                                            onClick={() => {
                                                setConfirmDelete(true);
                                                setDeleteRecordId(record.id);
                                            }}>Delete</button>
                                    </div>
                                </div>
                            )) }
                        </div>
                    
                        {/* workout stats */}
                        <WorkoutStats workoutStats={workoutStats}/>
                    </>
            ) : (
                <div className="mt-10 mx-auto p-5 sm:px-10 sm:max-w-[60%] flex flex-col items-center xs:max-w-[80%]
                    rounded-lg bg-theme/5 shadow-sm">
                    <p className="mb-6"><MdHourglassEmpty size={45} color="#777777"/></p>
                    <p className="text-center">You have not added any workout records yet. Start adding one and keep track of your fitness.</p>
                </div>
            ) }
        </div>
    )
});

export default WorkoutStatAndTable;