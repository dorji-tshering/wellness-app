import { FormEvent, useState, SetStateAction, ChangeEvent } from 'react';
import isNumeric from '../utils/isNumeric';
import { DocumentData, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { database } from '../firebaseClient';
import { useAuthValue } from '../utils/authContext';
import { useNotification } from '../utils/notificationContext';
import { isEqualObject } from '../utils/compareObjects';

interface FormData {
    date: string;
    timeSpent: string;
    caloriesBurned?: string;
    distanceCovered?: string;
}

interface InputErrors {
    timeInputError: string;
    caloriesInputError: string;
    distanceInputError: string;
}

type Props = {
    setShowForm: React.Dispatch<SetStateAction<boolean>>
    setEditMode: React.Dispatch<SetStateAction<boolean>>
    setRecordId: React.Dispatch<SetStateAction<string>>
    setEditableRecord: React.Dispatch<SetStateAction<DocumentData | null>>
    editing: boolean
    recordId?: string
    editableRecord: DocumentData | null
}

// component
const WorkoutForm = ({ setShowForm, setEditMode, setRecordId, editing, recordId, editableRecord, setEditableRecord }: Props) => {
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [inputError, setInputError] = useState<InputErrors>({
        timeInputError: '',
        caloriesInputError: '',
        distanceInputError: '',
    }); 
    const [formData, setFormData] = useState<FormData>(
        editing && editableRecord ? {
            date: editableRecord.data().date,
            timeSpent: editableRecord.data().timeSpent.toString(),
            caloriesBurned: editableRecord.data().caloriesBurned.toString(),
            distanceCovered: editableRecord.data().distanceCovered.toString(),
        } : {
            date: '',
            timeSpent: '',
            caloriesBurned: '',
            distanceCovered: '',
        }
    ); 

    const user = useAuthValue();
    const setNotification = useNotification()?.setNotification;

    const addWorkoutRecord = async(event: FormEvent) => {
        event.preventDefault();
        const { timeInputError, caloriesInputError, distanceInputError } = inputError;

        if(!formData.caloriesBurned && !formData.distanceCovered) {
            setFormError('Either calories or distance field is required');
            return;
        }

        if(!timeInputError && !caloriesInputError && !distanceInputError) {
            setSubmitting(true);
            await addDoc(collection(database, 'workout'), {
                date: formData.date,
                timeSpent: parseFloat(formData.timeSpent),
                caloriesBurned: parseFloat(formData.caloriesBurned as string),
                distanceCovered: parseFloat(formData.distanceCovered as string),
                userId: user?.uid
            });
            setSubmitting(false);
            setNotification && setNotification('Record added successfully.');
            setShowForm(false);
        } else {
            return;
        }

        

        //...
    }

    const editRecord = async(event: FormEvent) => {
        event.preventDefault();

        const { timeInputError, caloriesInputError, distanceInputError } = inputError;

        if(!formData.caloriesBurned && !formData.distanceCovered) {
            setFormError('Either calories or distance field is required');
            return;
        }

        if(!timeInputError && !caloriesInputError && !distanceInputError && recordId) {
            if(isEqualObject(formData, {
                date: editableRecord?.data().date,
                timeSpent: editableRecord?.data().timeSpent.toString(),
                caloriesBurned: editableRecord?.data().caloriesBurned.toString(),
                distanceCovered: editableRecord?.data().distanceCovered.toString(),
            }) && setNotification) {
                setNotification('No field value has been changed, please change any of the value to update.');
                return;
            }

            setSubmitting(true);
            await updateDoc(doc(database, 'workout', recordId), {
                date: formData.date,
                timeSpent: parseFloat(formData.timeSpent),
                caloriesBurned: parseFloat(formData.caloriesBurned as string),
                distanceCovered: parseFloat(formData.distanceCovered as string),
            });
            setSubmitting(false);
            setNotification && setNotification('Record updated successfully.');
            setRecordId('');
            setEditMode(false);
            setEditableRecord(null);
            setShowForm(false);
        } else {
            return;
        }
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value.trim(), // no spacing allowed for form values
        })

        if(value && !isNumeric(value) && (name !== 'date')) {
            switch (name) {
                case 'timeSpent': {
                    setInputError({
                        ...inputError,
                        timeInputError: 'Time spent must either be in decimal or number',
                    });
                    break;
                }
                case 'caloriesBurned': {
                    setInputError({
                        ...inputError,
                        caloriesInputError: 'Calories must either be in decimal or number',
                    });
                    break;
                }
                case 'distanceCovered': {
                    setInputError({
                        ...inputError,
                        distanceInputError: 'Distance must either be in decimal or number',
                    });
                    break;
                }
                default: 
                    break;
            }
        }else {
            if(name === 'timeSpent') {
                setInputError({
                    ...inputError,
                    timeInputError: ''
                });
            }else if(name === 'caloriesBurned') {
                setInputError({
                    ...inputError,
                    caloriesInputError: ''
                });
            }else if(name === 'distanceCovered') {
                setInputError({
                    ...inputError,
                    distanceInputError: ''
                });
            }
        }

        // remove form error when either of the field is entered
        if(formData.caloriesBurned || formData.distanceCovered) {
            setFormError('');
        }
    }

    const closeForm = () => {
        editing && setEditMode(false);
        recordId && setRecordId('');
        editableRecord && setEditableRecord(null);
        setShowForm(false);
    }

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center
             p-5 bg-black/30 z-20'
             onClick={closeForm}>
            <form 
                onSubmit={editing ? editRecord : addWorkoutRecord}
                onClick={(e) => e.stopPropagation()}
                className='bg-white max-h-full overflow-y-auto shadow-md rounded-md px-4 py-8 sm:p-8 flex flex-col'>
                <h2 className='text-center font-bold mb-5'>Add Wordout Record</h2>
                { formError && <p className='text-xs text-red-600 mb-3 text-center'>{formError}</p> }
                <div className='sm:flex sm:justify-between'>
                    <label className='sm:mr-5 mb-5 block'>
                        Date
                        <input 
                            type="date"
                            required
                            value={formData.date}
                            name='date'
                            max={new Date().toISOString().split("T")[0]}
                            onChange={handleInputChange}
                            className='block outline-none input-style'  />
                    </label>
                    <div className='mb-5'>
                        <label>
                            Time Spent <span className='text-gray-400 text-sm'>(in hours)</span>
                            <input 
                                type="text"
                                inputMode='numeric'
                                name='timeSpent'
                                required
                                value={formData.timeSpent}
                                onChange={handleInputChange}
                                className='input-style block' />
                        </label>
                        { inputError.timeInputError && <p className='text-xs max-w-[200px] text-red-600 mt-1'>{inputError.timeInputError}</p> }
                    </div>
                </div>
                <div className='sm:flex sm:justify-between'>
                    <div className='mb-5 sm:mr-5'>
                        <label>
                            Calories Burned <span className='text-gray-400 text-sm'>(in calories)</span>
                            <input 
                                type="text"
                                inputMode='decimal'
                                name='caloriesBurned'
                                value={formData.caloriesBurned}
                                onChange={handleInputChange}
                                className='input-style block' />
                        </label>
                        { inputError.caloriesInputError && <p className='text-xs max-w-[200px] text-red-600 mt-1'>{inputError.caloriesInputError}</p> }
                    </div>
                    <div className='mb-5'>
                        <label>
                            Distance Covered <span className='text-gray-400 text-sm'>(in kilometers)</span>
                            <input 
                                type="text"
                                inputMode='decimal'
                                name='distanceCovered'
                                value={formData.distanceCovered}
                                onChange={handleInputChange}
                                className='input-style block' />
                        </label>
                        { inputError.distanceInputError && <p className='text-xs max-w-[200px] text-red-600 mt-1'>{inputError.distanceInputError}</p> }
                    </div>
                </div>

                <div className='flex justify-center'>
                    <button 
                        type='submit'
                        className='bg-theme hover:bg-themeHover py-2 px-4 w-[80px] text-white rounded-md'>
                            { editing ? ( submitting ? '. . .' : 'Update') : (submitting ? '. . .' : 'Add')}
                        </button>
                    <button 
                        type='button'
                        className='py-2 px-4 rounded-md ml-5 hover:bg-gray-100 w-[80px] border-mainBorder border'
                        onClick={closeForm}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default WorkoutForm;