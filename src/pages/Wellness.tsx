import DesktopPageHeader from "../components/desktop-page-header";
import MobilePageHeader from "../components/mobile-page-header";
import IsMobile from "../utils/use-media-query";
import SleepRecordForm from "../components/sleep-record-form";
import { useEffect, useState } from 'react';
import SleepStats from "../components/sleep-stat";
import SleepRecord from "../components/sleep-record";
import ExcerciseGrid from "../components/exercise-grid";
import { fetchSleepRecords, selectStatus } from "../state/sleep-record/sleep-record.slice";
import { useAuthValue } from "../utils/auth-context";
import { useAppDispatch, useAppSelector } from "../state/hooks";

const Wellness = () => {
    const [showSleepRecordForm, setShowSleepRecordForm] = useState(false);
    const {isMobile} = IsMobile();
    const user = useAuthValue();
    const fetchStatus = useAppSelector(selectStatus);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(user && fetchStatus === 'idle') {
            dispatch(fetchSleepRecords(user.uid));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <div>
            { showSleepRecordForm && <SleepRecordForm setShowSleepRecordForm={setShowSleepRecordForm}/> }

            { !isMobile && (
                <DesktopPageHeader>
                    <div className="flex justify-between">
                        <h1 className="text-xl">Wellness</h1>
                        <div>
                            <button 
                                onClick={() => setShowSleepRecordForm(true)}
                                className="text-sm rounded-md px-3 py-2 font-medium transition-all duration-300
                                shadow-sm shadow-black/50 mr-3 text-gray-600 hover:text-black hover:bg-gray-100">
                                Date filter
                            </button>
                            <button 
                                onClick={() => setShowSleepRecordForm(true)}
                                className="text-sm bg-theme hover:bg-themeHover text-white rounded-md px-3 py-2 font-medium
                                shadow-sm shadow-black/50 transition-all duration-300">
                                Add sleep record
                            </button>
                        </div>
                    </div>
                </DesktopPageHeader>
            ) }

            { isMobile && (
                <MobilePageHeader> 
                    <div className="flex justify-between flex-wrap">
                        <h1 className="text-lg mr-2">Wellness</h1>
                        <div className="flex flex-col-reverse xs:flex-row">
                            <button 
                                onClick={() => setShowSleepRecordForm(true)}
                                className="text-sm  font-medium rounded-md px-2 py-1 shadow-sm shadow-black/50
                                whitespace-nowrap text-gray-600 hover:text-black hover:bg-gray-100 
                                transition-all duration-300 mr-0 ml-auto xs:mr-4 mt-3 xs:mt-0">
                                Date filter
                            </button>
                            <button 
                                onClick={() => setShowSleepRecordForm(true)}
                                className="text-sm bg-theme text-white font-medium rounded-md px-2 py-1 shadow-sm shadow-black/50
                                whitespace-nowrap">
                                Add sleep record
                            </button>
                        </div>
                    </div>
                </MobilePageHeader>
            ) }

            <div>
                <SleepStats/>
                <SleepRecord/>
                <ExcerciseGrid/>
            </div>
        </div>      
    )
}

export default Wellness