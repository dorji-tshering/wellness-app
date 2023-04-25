import { DocumentData, collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../firebaseClient";
import { useAuthValue } from "../utils/authContext";
import Loader from "./Loader";

const Workout= () => {
    const user = useAuthValue();
    const [records, setRecords] = useState<Array<DocumentData>>([]);
    const [loadingData, setLoadingData] = useState(true); 

    useEffect(() => {
        const q = query(collection(database, 'workout'), where('userId', '==', user?.uid), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setRecords(querySnapshot.docs);
            setLoadingData(false);
        });

        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    if(loadingData) {
        return <Loader/>
    }

    return (
        <div>
            { records.length > 0 ? (
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
                                        py-2 sm:py-0 text-theme text-sm sm:hover:underline">Edit</button>
                                    <button 
                                        className="w-[80px] sm:w-auto rounded-[4px] bg-red-100 sm:bg-transparent
                                        py-2 sm:py-0 text-red-600 text-sm sm:hover:underline">Delete</button>
                                </div>
                            </div>
                        )) }
                    </div>
            ) : (
                <div></div>
            ) }
        </div>
    )
}

export default Workout