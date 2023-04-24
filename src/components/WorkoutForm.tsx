import { FormEvent, useState, SetStateAction, ChangeEvent } from 'react';
import isNumeric from '../utils/isNumeric';

interface FormData {
    date: string;
    timeSpent: string;
    caloriesBurned?: string;
    distanceCovered?: string;
}

interface InputErrors {
    timeSpent: string;
    caloriesBurned: string;
    distanceCovered: string;
}

type Props = {
    setShowForm: React.Dispatch<SetStateAction<boolean>>
}

// component
const WorkoutForm = ({ setShowForm }: Props) => {
    const [formError, setFormError] = useState('');
    const [inputError, setInputError] = useState<InputErrors>({
        timeSpent: '',
        caloriesBurned: '',
        distanceCovered: '',
    }); 
    const [formData, setFormData] = useState<FormData>({
        date: '',
        timeSpent: '',
        caloriesBurned: '',
        distanceCovered: '',
    }); 

    const addWorkoutRecord = async(event: FormEvent) => {
        event.preventDefault();
        const { timeSpent, caloriesBurned, distanceCovered } = inputError;

        if(!formData.caloriesBurned && !formData.distanceCovered) {
            setFormError('Either calories burned or distance covered field is required');
            return;
        }

        if(!timeSpent && !caloriesBurned && !distanceCovered && (formData.caloriesBurned || formData.distanceCovered)) {
            console.log('valid form')
        } else {

        }

        

        //...
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        })

        if(value && !isNumeric(value) && (name !== 'date')) {
            switch (name) {
                case 'timeSpent': {
                    setInputError({
                        ...inputError,
                        [name]: 'Time spent must either be in decimal or number',
                    });
                    break;
                }
                case 'caloriesBurned': {
                    setInputError({
                        ...inputError,
                        [name]: 'Calories must either be in decimal or number',
                    });
                    break;
                }
                case 'distanceCovered': {
                    setInputError({
                        ...inputError,
                        [name]: 'Distance must either be in decimal or number',
                    });
                    console.log('distance')
                    break;
                }
                default: 
                    break;
            }
        }else {
            setInputError({
                ...inputError,
                [name]: '',
            });
        }

        // remove form error when one of the formdata is entered
        if(formData.caloriesBurned || formData.distanceCovered) {
            setFormError('');
        }
    }

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center
             p-5 bg-black/30 z-20'
             onClick={() => setShowForm(false)}>
            <form 
                onSubmit={addWorkoutRecord}
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
                        { inputError.timeSpent && <p className='text-xs max-w-[200px] text-red-600 mt-1'>{inputError.timeSpent}</p> }
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
                        { inputError.caloriesBurned && <p className='text-xs max-w-[200px] text-red-600 mt-1'>{inputError.caloriesBurned}</p> }
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
                        { inputError.distanceCovered && <p className='text-xs max-w-[200px] text-red-600 mt-1'>{inputError.distanceCovered}</p> }
                    </div>
                </div>

                <div className='flex justify-center'>
                    <button 
                        type='submit'
                        className='bg-theme hover:bg-themeHover py-2 px-4 w-[80px] text-white rounded-md'>Add</button>
                    <button 
                        type='button'
                        className='py-2 px-4 rounded-md ml-5 hover:bg-gray-100 w-[80px] border-mainBorder border'
                        onClick={() => setShowForm(false)}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default WorkoutForm;