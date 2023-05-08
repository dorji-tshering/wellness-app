import { useState } from "react";
import DesktopPageHeader from "../components/desktop-page-header";
import MobilePageHeader from "../components/mobile-page-header";
import IsMobile from "../utils/use-media-query";
import WorkoutForm from "../components/workout-form";
import WorkoutStatAndTable from "../components/workout-stat-and-table";
import { DocumentData } from "firebase/firestore";
import { ErrorBoundary } from "react-error-boundary";

const Fitness = () => {
    const {isMobile} = IsMobile();
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
                        <h1 className="lg">My Fitness</h1>
                        <button 
                            onClick={() => setShowWorkoutForm(true)}
                            className="text-sm bg-theme text-white font-medium rounded-md px-2 py-1 shadow-sm shadow-black/50">
                            Add workout
                        </button>
                    </div>
                </MobilePageHeader>
            ) }

            <div>
                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                    <WorkoutStatAndTable 
                        setEditMode={setEditMode} 
                        setShowWorkoutForm={setShowWorkoutForm} 
                        setRecordId={setRecordId}
                        setEditableRecord={setEditableRecord}/>
                </ErrorBoundary>
            </div>
        </div>
    )
}

export default Fitness;