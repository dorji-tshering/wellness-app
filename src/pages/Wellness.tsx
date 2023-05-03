import DesktopPageHeader from "../components/DesktopPageHeader";
import MobilePageHeader from "../components/MobilePageHeader";
import IsMobile from "../utils/useMediaQuery";
import SleepRecordForm from "../components/SleepRecordForm";
import { useState } from 'react';
import SleepStats from "../components/SleepStats";
import SleepRecord from "../components/SleepRecord";
import ExcerciseGrid from "../components/ExcerciseGrid";

const Wellness = () => {
    const [showSleepRecordForm, setShowSleepRecordForm] = useState(false);
    const {isMobile} = IsMobile();

    return (
        <div>
            { showSleepRecordForm && <SleepRecordForm setShowSleepRecordForm={setShowSleepRecordForm}/> }

            { !isMobile && (
                <DesktopPageHeader>
                    <div className="flex justify-between">
                        <h1 className="text-xl">Wellness</h1>
                        <button 
                            onClick={() => setShowSleepRecordForm(true)}
                            className="text-sm bg-theme hover:bg-themeHover text-white rounded-md px-3 py-2 font-medium
                            shadow-sm shadow-black/50">
                            Add sleep record
                        </button>
                    </div>
                </DesktopPageHeader>
            ) }

            { isMobile && (
                <MobilePageHeader> 
                    <div className="flex justify-between flex-wrap">
                        <h1 className="text-lg mr-2">Wellness</h1>
                        <button 
                            onClick={() => setShowSleepRecordForm(true)}
                            className="text-sm bg-theme text-white font-medium rounded-md px-2 py-1 shadow-sm shadow-black/50
                            whitespace-nowrap">
                            Add sleep record
                        </button>
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