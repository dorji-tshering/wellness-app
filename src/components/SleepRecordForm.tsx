import { SetStateAction, FormEvent, useState, ChangeEvent } from 'react';
import isNumeric from '../utils/isNumeric';
import classNames from 'classnames';
import { addDoc, collection } from 'firebase/firestore';
import { database } from '../firebaseClient';
import { useAuthValue } from '../utils/authContext';
import { useNotification } from '../utils/notificationContext';

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
    const [submittingForm, setSubmittingForm] = useState(false);
    const [sleepTimeError, setSleepTimeError] = useState('');
    const [sleepQualityError, setSleepQualityError] = useState('');
    const [sleepData, setSleepData] = useState<SleepData>({
        date: '',
        sleepTime: '',
        sleepQuality: null
    });
    const user = useAuthValue();
    const setNotification = useNotification()?.setNotification;
    const sleepQualities = ['Excellent', 'Good', 'Poor'] as const;
    const addSleepRecord = async(event: FormEvent) => {
        event.preventDefault();

        if(!sleepData.sleepQuality) {
            setSleepQualityError('Please select your sleep quality');
            return;
        }else {
            setSleepQualityError('');
        }

        if(!sleepTimeError) {
            setSubmittingForm(true);
            await addDoc(collection(database, 'sleeprecords'), {
                date: sleepData.date,
                sleepTime: parseFloat(sleepData.sleepTime),
                sleepQuality: sleepData.sleepQuality,
                userId: user?.uid,
            })
            setSubmittingForm(false);
            setShowSleepRecordForm(false);
            setNotification &&  setNotification('Your record has been added successfully.');
        }else {
            return;
        }
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSleepData({
            ...sleepData,
            [name]: value.trim(), // no spacing allowed for form values
        })

        if(value && name === 'sleepTime' && !isNumeric(value)) {
            setSleepTimeError('Sleep time should either be in decimal or number');
        }else {
            sleepTimeError && setSleepTimeError('');
        }
    }

    return (
        <div className='fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-30 flex justify-center items-center px-4 py-5'
            onClick={() => setShowSleepRecordForm(false)}>
            <div className="max-h-full overflow-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={addSleepRecord} className="bg-white rounded-md shadow-md px-3 xs:px-8 py-5">
                    <h1 className='text-center font-medium mb-4'>Add sleep record</h1>
                    <label className='mb-5 block'>
                        Date
                        <input 
                            type="date"
                            required
                            value={sleepData.date}
                            name='date'
                            max={new Date().toISOString().split("T")[0]}
                            onChange={handleInputChange}
                            className='block outline-none input-style'  />
                    </label>
                    <div className='mb-4'>
                        <label className='block'>
                            Sleep time <span className='text-gray-400 text-sm'>(in hours)</span>
                            <input 
                                type="text"
                                inputMode='decimal'
                                name='sleepTime'
                                value={sleepData.sleepTime}
                                onChange={handleInputChange}
                                className='input-style block' />
                        </label>
                        { sleepTimeError && <span className='max-w-[200px] block mt-1 text-xs text-red-600'>{sleepTimeError}</span> }
                    </div>
                    <p className='mb-4'>
                        SLeep quality
                        <span className={classNames('input-style block cursor-pointer',
                            !sleepData.sleepQuality && 'text-gray-400')} 
                            onClick={() => setShowSleepQualities(true)}>
                            { sleepData.sleepQuality ?? '--select quality--' }
                        </span>
                        { sleepQualityError && <span className='max-w-[200px] block mt-1 text-xs text-red-600'>{sleepQualityError}</span> }
                    </p>
                    <div className='flex justify-center'>
                        <button 
                            type='submit'
                            className='bg-theme hover:bg-themeHover py-2 px-4 w-[80px] text-white rounded-md text-sm font-medium'>
                                { submittingForm ? '. . .' : 'Add'}
                            </button>
                        <button 
                            type='button'
                            className='py-2 px-4 rounded-md ml-5 hover:bg-gray-100 w-[80px] border-mainBorder border text-sm font-medium'
                            onClick={() => setShowSleepRecordForm(false)}>Cancel</button>
                    </div>
                </form>
            </div>

            {/* sleep quality options */}
            { showSleepQualities && (
                <div className='absolute top-0 right-0 left-0 bottom-0 z-40 flex items-center justify-center bg-black/30 px-4 py-5'
                    onClick={(e) => {
                        e.stopPropagation(); 
                        setShowSleepQualities(false);
                    }}>
                    <div className='max-h-full overflow-auto rounded-md min-w-[200px]' onClick={(e) => e.stopPropagation()}>
                        <ul className='bg-white rounded-md py-2'>
                            { sleepQualities.map((sleepQuality, idx) => (
                                <li className={classNames('text-center py-2 px-8 cursor-pointer',
                                    sleepData.sleepQuality === sleepQuality ? 'bg-theme text-white' : 
                                    'hover:bg-gray-100')}
                                    key={idx} onClick={() => {
                                    setSleepData({
                                        ...sleepData,
                                        sleepQuality: sleepQuality
                                    });
                                    setShowSleepQualities(false);
                                    }}>
                                    { sleepQuality }
                                </li>
                            )) }
                        </ul>
                    </div>
                </div>
            ) }
        </div>
    )
}

export default SleepRecordForm;