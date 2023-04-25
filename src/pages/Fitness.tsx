import { useState } from "react";
import DesktopPageHeader from "../components/DesktopPageHeader";
import MobilePageHeader from "../components/MobilePageHeader";
import IsMobile from "../utils/useMediaQuery";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutTable from "../components/WorkoutTable";

const Fitness = () => {
    const isMobile = IsMobile();
    const [showWorkoutForm, setShowWorkoutForm] = useState(false);

    return (
        <div>
            { showWorkoutForm && <WorkoutForm setShowForm={setShowWorkoutForm}/> }

            { !isMobile && (
                <DesktopPageHeader>
                    <div className="flex justify-between">
                        <h1>My Fitness</h1>
                        <button 
                            onClick={() => setShowWorkoutForm(true)}
                            className="text-sm bg-theme text-white rounded-md px-3 py-2 font-medium">Add workout</button>
                    </div>
                </DesktopPageHeader>
            ) }

            { isMobile && (
                <MobilePageHeader> 
                    <div className="flex justify-between">
                        <h1>My Fitness</h1>
                        <button 
                            onClick={() => setShowWorkoutForm(true)}
                            className="text-sm bg-theme text-white font-medium rounded-md px-3 py-2">Add workout</button>
                    </div>
                </MobilePageHeader>
            ) }

            <div>
                <WorkoutTable/>
            </div>
        </div>
    )
}

export default Fitness