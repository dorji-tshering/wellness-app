import { SetStateAction, useState } from 'react';
import isNumeric from '../utils/isNumeric';
import classNames from 'classnames';
import { addDoc, collection } from 'firebase/firestore';
import { database } from '../firebaseClient';
import { useAuthValue } from '../utils/authContext';
import { useNotification } from '../utils/notificationContext';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

type Props = {
    setShowSleepRecordForm: React.Dispatch<SetStateAction<boolean>>
}

type SleepData = {
    date: string
    sleepTime: string
    sleepQuality: 'Excellent' | 'Good' | 'Poor' | null
}

const SleepRecordForm = ({ setShowSleepRecordForm }: Props) => {
    const [showSleepQualities, setShowSleepQualities] = useState(false);
    const user = useAuthValue();
    const setNotification = useNotification()?.setNotification;
    const sleepQualities = ['Excellent', 'Good', 'Poor'] as const;

    const addSleepRecord = async(values: SleepData) => {
        const { date, sleepTime, sleepQuality } = values;

        if(!sleepTime || !sleepTime.trim()) {
            return { sleepTime: 'Sleep time is required' }
        }

        if(!sleepQuality) {
            return { sleepQuality: 'Select your sleep quality' }
        }

        try {
            await addDoc(collection(database, 'sleeprecords'), {
                date: date,
                sleepTime: parseFloat(sleepTime),
                sleepQuality: sleepQuality,
                userId: user?.uid,
            })
            setShowSleepRecordForm(false);
            setNotification &&  setNotification('Your record has been added successfully.');
        }catch(err: any) {
            return { [FORM_ERROR]: err.code }
        }
    }

    return (
        <div className='fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-30 flex justify-center items-center px-4 py-5'
            onClick={() => setShowSleepRecordForm(false)}>
            <div className="max-h-full overflow-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                <Form onSubmit={addSleepRecord}>
                    {({ handleSubmit, submitting, values, submitError }) => (
                        <>
                            <form onSubmit={handleSubmit}
                                className='bg-white rounded-md shadow-md px-3 xs:px-8 py-5'>
                                <h2 className='text-center text-lg font-bold mb-4'>Add sleep record</h2>
                                { submitError && <p className='text-xs text-red-600 mb-3 text-center -mt-3'>{ submitError }</p> }
                                <Field name='date' type='date'>
                                    {({ input }) => (
                                        <label className='mb-5 block'>
                                            Date
                                            <input 
                                                {...input}
                                                required
                                                max={new Date().toISOString().split("T")[0]}
                                                className='block outline-none input-style'  />
                                        </label>
                                    )}
                                </Field>
                                <div className='mb-4'>
                                    <Field name='sleepTime' type='text'
                                        validate={(value) => value && !isNumeric(value) && 'Value should be either decimal or number'}>
                                        {({ input, meta }) => (
                                            <>
                                                <label className='block'>
                                                    Sleep timeeee <span className='text-gray-400 text-sm'>(in hours)</span>
                                                    <input 
                                                        {...input}
                                                        inputMode='decimal'   
                                                        className='input-style block' />
                                                </label>
                                                { (meta.error || meta.submitError) && meta.touched && (<span className='max-w-[200px] block mt-1 text-xs text-red-600'>
                                                    {meta.error || meta.submitError}
                                                    </span>
                                                ) }
                                            </>
                                        )}
                                    </Field>
                                </div>

                                <p className='mb-4'>
                                    <Field name='sleepQuality'>
                                        {({ meta }) => (
                                            <>
                                                SLeep quality
                                                <span className={classNames('input-style block cursor-pointer',
                                                    !values.sleepQuality && 'text-gray-400')} 
                                                    onClick={() => setShowSleepQualities(true)}>
                                                    { values.sleepQuality ?? '--select quality--' }
                                                </span>
                                                    { meta.submitError && <span className='max-w-[200px] block mt-1 text-xs text-red-600'>
                                                    { meta.submitError }
                                                </span> }
                                            </>
                                        )}
                                    </Field>
                                </p>
                                <div className='flex justify-center'>
                                    <button 
                                        type='submit'
                                        className='bg-theme hover:bg-themeHover py-2 px-4 w-[80px] text-white rounded-md text-sm font-medium'>
                                            { submitting ? '. . .' : 'Add'}
                                        </button>
                                    <button 
                                        type='button'
                                        className='py-2 px-4 rounded-md ml-5 hover:bg-gray-100 w-[80px] border-mainBorder 
                                        border text-sm font-medium'
                                        onClick={() => setShowSleepRecordForm(false)}>Cancel</button>
                                </div>
                            </form>

                            {/* sleep quality options */}
                            { showSleepQualities && (
                                <div className='absolute top-0 right-0 left-0 bottom-0 z-50 flex items-center justify-center bg-black/30 px-4 py-5'
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        setShowSleepQualities(false);
                                    }}>
                                    <div className='max-h-full overflow-auto rounded-md min-w-[200px]' onClick={(e) => e.stopPropagation()}>
                                        <ul className='bg-white rounded-md py-2'>
                                            { sleepQualities.map((sleepQuality, idx) => (
                                                <li className={classNames('text-center py-2 px-8 cursor-pointer',
                                                    values.sleepQuality === sleepQuality ? 'bg-theme text-white' : 
                                                    'hover:bg-gray-100')}
                                                    key={idx} onClick={() => {
                                                    values.sleepQuality = sleepQuality;
                                                    setShowSleepQualities(false);
                                                    }}>
                                                    { sleepQuality }
                                                </li>
                                            )) }
                                        </ul>
                                    </div>
                                </div>
                            ) }
                        </>
                    )}
                </Form>
            </div>
        </div>
    )
}

export default SleepRecordForm;