import { DocumentData } from "firebase/firestore";

export interface FormData {
    date: string;
    timeSpent: string;
    caloriesBurned?: string;
    distanceCovered?: string;
}

export type Props = {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
    setRecordId: React.Dispatch<React.SetStateAction<string>>
    setEditableRecord: React.Dispatch<React.SetStateAction<DocumentData | null>>
    editing: boolean
    recordId?: string
    editableRecord: DocumentData | null
}