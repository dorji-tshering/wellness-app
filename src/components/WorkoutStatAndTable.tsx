import { DocumentData, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState, SetStateAction } from 'react';
import { database } from "../firebaseClient";
import { useAuthValue } from "../utils/authContext";
import Loader from "./Loader";
import { useNotification } from "../utils/notificationContext";

type Props = {
    setEditMode: React.Dispatch<SetStateAction<boolean>>
    setShowWorkoutForm: React.Dispatch<SetStateAction<boolean>> 
    setRecordId: React.Dispatch<SetStateAction<string>> 
    setEditableRecord: React.Dispatch<SetStateAction<DocumentData>>
}

const WorkoutStatAndTable= ({ setEditMode, setShowWorkoutForm, setRecordId, setEditableRecord }: Props) => {
    const user = useAuthValue();
    const [records, setRecords] = useState<Array<DocumentData>>([]);
    const [loadingData, setLoadingData] = useState(true); 
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteRecordId, setDeleteRecordId] = useState('');
    const [deleting, setDeleting] = useState(false);
    const setNotification = useNotification()?.setNotification;

    useEffect(() => {
        const q = query(collection(database, 'workout'), where('userId', '==', user?.uid), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setRecords(querySnapshot.docs);
            setLoadingData(false);
        });

        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const deleteRecord = async() => {
        setDeleting(true);
        await deleteDoc(doc(database, 'workout', deleteRecordId));
        setNotification && setNotification('Record deleted successfully.');
        setDeleteRecordId('');
        setDeleting(false)
        setConfirmDelete(false);
    }

    const showEditForm = (recordId: string, record: DocumentData) => {
        setEditMode(true);
        setShowWorkoutForm(true);
        setEditableRecord(record);
        setRecordId(recordId);
    }

    if(loadingData) {
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
                    <div className="bg-white rounded-md shadow-md p-5 flex flex-col justify-center items-center"
                        onClick={(e) => e.stopPropagation()}>
                        <p className="font-medium mb-5">Confirm Delete?</p>
                        <div className="flex justify-center">
                            <button className="w-[70px] text-white mr-2 bg-red-600 rounded-[4px] py-1" 
                                onClick={deleteRecord}>{ deleting ? '. . .' : 'Delete' }</button>
                            <button className="w-[70px] text-white ml-2 bg-gray-500 rounded-[4px] py-1"
                                onClick={() => setConfirmDelete(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            ) }
            { records.length > 0 ? (
                    <>  {/* workout record table */}
                        <div className="mx-auto xs:max-w-[70%] sm:max-w-full xl:max-w-[80%] flex flex-col border border-mainBorder rounded-md">
                            <div className="hidden sm:grid sm:grid-cols-5 border-b border-b-mainBorder bg-gray-100 
                                rounded-tr-md rounded-tl-md">
                                <span className="workout-table-head">Date</span>
                                <span className="workout-table-head">Time</span>
                                <span className="workout-table-head">Calories</span>
                                <span className="workout-table-head">Distance</span>
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
                                        <span className="whitespace-nowrap text-gray-500 sm:text-inherit">{record.data().date}</span>
                                    </div>
                                    <div className="workout-table-cell">
                                        <span className="sm:hidden font-medium">Time</span>
                                        <span className="text-gray-500 sm:text-inherit">{record.data().timeSpent}</span>
                                    </div>
                                    <div className="workout-table-cell">
                                        <span className="sm:hidden font-medium">Calories</span>
                                        <span className="text-gray-500 sm:text-inherit">{record.data().caloriesBurned}</span>
                                    </div>
                                    <div className="workout-table-cell">
                                        <span className="sm:hidden font-medium">Distance</span>
                                        <span className="text-gray-500 sm:text-inherit">{record.data().distanceCovered}</span>
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
                        <div>
                            
                        </div>
                    </>
            ) : (
                <div></div>
            ) }
        </div>
    )
}

export default WorkoutStatAndTable;