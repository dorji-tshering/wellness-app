import { deleteDoc, doc } from "firebase/firestore";
import { memo, useState } from 'react';
import { database } from "../../firebaseClient";
import { useAuthValue } from "../../hooks/use-auth-context";
import Loader from "../loader/loader";
import { useNotification } from "../../hooks/use-notification-context";
import { GiTimeBomb, GiPathDistance, GiAtomCore } from 'react-icons/gi';
import { MdHourglassEmpty } from 'react-icons/md';
import { Props, WorkoutStats } from "../../model/workout-stat-and-table";
import { selectRecords, selectStatus, selectWorkoutStats } from "../../state/workout-stats/workout-stat.slice";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { fetchWorkoutStats } from "../../state/workout-stats/workout-stat.slice";
import { useFetch } from "../../hooks/use-fetch";

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
    const workoutStats = useAppSelector(selectWorkoutStats);
    const records = useAppSelector(selectRecords);
    const dispatch = useAppDispatch();

    useFetch('workoutStats', user, status);

    const deleteRecord = async() => {
        setDeleting(true);
        await deleteDoc(doc(database, 'workout', deleteRecordId));
        setNotification && setNotification('Record deleted successfully.');
        user && await dispatch(fetchWorkoutStats(user.uid));
        setDeleteRecordId('');
        setDeleting(false);
        setConfirmDelete(false);
    }

    const showEditForm = (recordId: string, record: WorkoutStats & {id: string, date: string}) => {
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
                        <div className="mx-auto xs:max-w-[70%] sm:max-w-full xl:max-w-[80%] flex flex-col border border-mainBorder rounded-md">
                            <div className="hidden sm:grid sm:grid-cols-5 border-b border-b-mainBorder bg-gray-100 
                                rounded-tr-md rounded-tl-md">
                                <span className="workout-table-head">Date</span>
                                <span className="workout-table-head">Time <span className="text-xs text-gray-500 pl-[2px]">(hr)</span></span>
                                <span className="workout-table-head">Calories <span className="text-xs text-gray-500 pl-[2px]">(cal)</span></span>
                                <span className="workout-table-head">Distance <span className="text-xs text-gray-500 pl-[2px]">(km)</span></span>
                                <span className="px-3 py-2 font-medium">Actions</span>
                            </div>
                            { records.map((record, idx) => (
                                <div 
                                    key={idx}
                                    className="flex flex-col sm:grid sm:grid-cols-5 border-b border-b-black 
                                    sm:border-b-mainBorder last:border-b-0
                                    ">
                                    <div className="workout-table-cell">
                                        <span className="sm:hidden font-medium">Date</span>
                                        <span className="whitespace-nowrap text-gray-500 sm:text-inherit">{record.date}</span>
                                    </div>
                                    <div className="workout-table-cell">
                                        <span className="sm:hidden font-medium">Time <span className="text-xs text-gray-500 pl-[2px]">(hr)</span></span>
                                        <span className="text-gray-500 sm:text-inherit">{record.timeSpent}</span>
                                    </div>
                                    <div className="workout-table-cell">
                                        <span className="sm:hidden font-medium">Calories <span className="text-xs text-gray-500 pl-[2px]">(cal)</span></span>
                                        <span className="text-gray-500 sm:text-inherit">{record.caloriesBurned}</span>
                                    </div>
                                    <div className="workout-table-cell">
                                        <span className="sm:hidden font-medium">Distance <span className="text-xs text-gray-500 pl-[2px]">(km)</span></span>
                                        <span className="text-gray-500 sm:text-inherit">{record.distanceCovered}</span>
                                    </div>
                                    <div className="flex justify-between py-1 sm:py-2 px-3 font-medium">
                                        <button 
                                            className="w-[80px] sm:w-auto rounded-[4px] bg-theme/5 sm:bg-transparent
                                            py-2 sm:py-0 text-theme text-sm sm:hover:underline"
                                            onClick={() => showEditForm(record.id, record)}>Edit</button>
                                        <button 
                                            className="w-[80px] sm:w-auto rounded-[4px] bg-red-100 sm:bg-transparent
                                            py-2 sm:py-0 text-red-600 text-sm sm:hover:underline"
                                            onClick={() => {
                                                setConfirmDelete(true);
                                                setDeleteRecordId(record.id);
                                            }}>Delete</button>
                                    </div>
                                </div>
                            )) }
                        </div>
                    
                        {/* workout stats */}
                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xs:max-w-[70%] 
                             sm:max-w-full xl:max-w-[80%] mx-auto mt-10 justify-between ">
                            <div className="flex flex-col justify-center items-center py-6 rounded-md bg-[#67079F]/5
                                mb-10 sm:basis-[30%] md:basis-full lg:basis-[30%]">
                                <p className="mb-3"><GiTimeBomb size={30} color="#67079F"/></p>
                                <p className="">Time Spent</p>
                                <span className="mb-5 text-gray-500">(hr)</span>
                                <p className="text-5xl font-bold text-[#67079F]">{workoutStats.timeSpent}</p>
                            </div>
                            <div className="flex flex-col justify-between items-center py-6 rounded-md bg-[#F2A90D]/5
                                mb-10 sm:basis-[30%] md:basis-full lg:basis-[30%]">
                                <p className="mb-3"><GiAtomCore size={30} color="#F2A90D"/></p>
                                <p className="">Calories Burned</p>
                                <span className="mb-5 text-gray-500">(cal)</span>
                                <p className="text-5xl font-bold text-[#F2A90D]">{workoutStats.caloriesBurned}</p>
                            </div>
                            <div className="flex flex-col justify-between items-center py-6 rounded-md bg-[#1CC115]/5
                            mb-10 sm:basis-[30%] md:basis-full lg:basis-[30%]">
                                <p className="mb-3"><GiPathDistance size={30} color="#1CC115"/></p>
                                <p className="">Distance Covered</p>
                                <span className="mb-5 text-gray-500">(km)</span>
                                <p className="text-5xl font-bold text-[#1CC115]">{workoutStats.distanceCovered}</p>
                            </div>
                        </div>
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