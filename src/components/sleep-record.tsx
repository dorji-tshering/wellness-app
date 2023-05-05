import { DocumentData, collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../firebaseClient";
import { useAuthValue } from "../utils/auth-context";
import Loader from "./loader";

const SleepRecord = () => {
    const [showRecordTable, setShowRecordTable] = useState(false);
    const [sleepRecords, setSleepRecords] = useState<Array<DocumentData>>([]);
    const [loadingData, setLoadingData] = useState(true);
    const user = useAuthValue();

    useEffect(() => {
        if(user) {
            const q = query(collection(database, 'sleeprecords'), where('userId', '==', user.uid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                setSleepRecords(querySnapshot.docs);
                setLoadingData(false);
            })

            return () => unsubscribe();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    if(loadingData) {
        return (
            <div className="w-full relative h-[200px]">
                <Loader/>
            </div>
        )
    }


    return (
        <>
            { sleepRecords.length > 0 && (
                <div>
                    <button className="block text-gray-600 font-medium mb-6 hover:text-theme hover:underline"
                        onClick={() => setShowRecordTable(!showRecordTable)}>{ showRecordTable ? 'Hide record' : 'View record' }
                    </button>
                    { showRecordTable && (
                        <>
                            <div className="mx-auto xs:max-w-[70%] sm:max-w-full xl:max-w-[80%] flex flex-col border border-mainBorder rounded-md
                                mb-8">
                                <div className="hidden sm:grid sm:grid-cols-3 border-b border-b-mainBorder bg-gray-100 
                                    rounded-tr-md rounded-tl-md">
                                    <p className="border-r border-r-mainBorder px-3 py-2 font-medium
                                        flex items-center">Date</p>
                                    <p className="border-r border-r-mainBorder px-3 py-2 font-medium
                                        flex items-center">Sleep time <span className="text-xs text-gray-500 pl-[2px]">(hrs)</span></p>
                                    <p className="px-3 py-2 font-medium
                                        flex items-center">Sleep quality</p>
                                </div>
                                { sleepRecords.map((record, idx) => (
                                    <div className="flex flex-col sm:grid sm:grid-cols-3 border-b border-b-black 
                                        sm:border-b-mainBorder last:border-b-0"
                                        key={idx}>
                                        <div className="flex justify-between sm:block px-3 py-2 border-r border-r-mainBorder
                                            border-b border-b-mainBorder sm:border-b-0">
                                            <span className="sm:hidden font-medium">Date</span>
                                            <span className="text-gray-500 sm:text-inherit">{ record.data().date }</span>
                                        </div>
                                        <div className="flex justify-between sm:block px-3 py-2 border-r border-r-mainBorder
                                            border-b border-b-mainBorder sm:border-b-0">
                                            <span className="sm:hidden font-medium">
                                                Sleep time <span className="text-xs text-gray-500 pl-[2px]">(hrs)</span>
                                            </span>
                                            <span className="text-gray-500 sm:text-inherit">{ record.data().sleepTime }</span>
                                        </div>
                                        <div className="flex justify-between sm:block px-3 py-2">
                                            <span className="sm:hidden font-medium">Sleep quality</span>
                                            <span className="text-gray-500 sm:text-inherit">{ record.data().sleepQuality }</span>
                                        </div>
                                    </div>
                                )) }
                            </div>
                        </>
                    ) }
                </div>
            ) }
        </>
    )
}

export default SleepRecord;