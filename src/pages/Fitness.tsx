import { useState } from "react";
import DesktopPageHeader from "../components/DesktopPageHeader";
import MobilePageHeader from "../components/MobilePageHeader";
import IsMobile from "../utils/useMediaQuery";
import WorkoutForm from "../components/WorkoutForm";
import WorkoutStatAndTable from "../components/WorkoutStatAndTable";
import { DocumentData } from "firebase/firestore";

const Fitness = () => {
    const isMobile = IsMobile();
    const [showWorkoutForm, setShowWorkoutForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [recordId, setRecordId] = useState('');
    const [editableRecord, setEditableRecord] = useState<DocumentData | null>(null);

    return (
        <div>
            { showWorkoutForm && 
                <WorkoutForm 
                    setShowForm={setShowWorkoutForm} 
                    setEditMode={setEditMode}
                    setRecordId={setRecordId}
                    editing={editMode ? true : false} 
                    recordId={recordId}
                    editableRecord={editableRecord}
                    setEditableRecord={setEditableRecord}/> }

            { !isMobile && (
                <DesktopPageHeader>
                    <div className="flex justify-between">
                        <h1 className="text-xl">My Fitness</h1>
                        <button 
                            onClick={() => setShowWorkoutForm(true)}
                            className="text-sm bg-theme hover:bg-themeHover text-white rounded-md px-3 py-2 font-medium
                            shadow-sm shadow-black/50">
                            Add workout
                        </button>
                    </div>
                </DesktopPageHeader>
            ) }

            { isMobile && (
                <MobilePageHeader> 
                    <div className="flex justify-between">
                        <h1>My Fitness</h1>
                        <button 
                            onClick={() => setShowWorkoutForm(true)}
                            className="text-sm bg-theme text-white font-medium rounded-md px-3 py-2 shadow-sm shadow-black/50">
                            Add workout
                        </button>
                    </div>
                </MobilePageHeader>
            ) }

            <div>
                <WorkoutStatAndTable 
                    setEditMode={setEditMode} 
                    setShowWorkoutForm={setShowWorkoutForm} 
                    setRecordId={setRecordId}
                    setEditableRecord={setEditableRecord}/>
            </div>
        </div>
    )
}

export default Fitness;