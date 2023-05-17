import isNumeric from '../../utils/is-numeric';
import { useAuthValue } from '../../hooks/use-auth-context';
import { useNotification } from '../../hooks/use-notification-context';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import classNames from 'classnames';
import { FormData, Props,  } from '../../model/workout-form';
import { addWorkoutRecord, editWorkoutRecord } from '../../services/facade.service';
import { useAppDispatch } from '../../state/hooks';
import { fetchWorkoutStats } from '../../state/workout-stats/workout-stat.slice';

const WorkoutForm = ({ setShowForm, setEditMode, setRecordId, editing, recordId, 
    editableRecord, setEditableRecord }: Props) => {
    const user = useAuthValue();
    const setNotification = useNotification()?.setNotification;
    const dispatch = useAppDispatch();

    const handleWorkoutRecordAdd = async(values: FormData) => {
        const { caloriesBurned, distanceCovered } = values;

        if((!caloriesBurned || !caloriesBurned.trim()) && (!distanceCovered || !distanceCovered.trim())) {
            return { [FORM_ERROR]: 'Either distance or calories field is required' }
        }

        try {
            user && await addWorkoutRecord(user.uid, values);
            setNotification && setNotification('Record added successfully.');
            user && await dispatch(fetchWorkoutStats(user.uid));
            setShowForm(false);
        }catch(err: any) {
            return { [FORM_ERROR]: err.code };
        }
    }

    const handleWorkoutRecordEdit = async(values: FormData) => {
        const { caloriesBurned, distanceCovered } = values;

        if((!caloriesBurned || !caloriesBurned.trim()) && (!distanceCovered || !distanceCovered.trim())) {
            return { [FORM_ERROR]: 'Either distance or calories field is required' }
        }
        try {
            recordId && editWorkoutRecord(recordId, values);
            setNotification && setNotification('Record updated successfully.');
            user && await dispatch(fetchWorkoutStats(user.uid));
            setRecordId('');
            setEditMode(false);
            setEditableRecord(null);
            setShowForm(false);
        }catch(err: any) {
            return { [FORM_ERROR]: err.code };
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
            px-2 py-5 xs:p-5 bg-black/30 z-30'
            onClick={closeForm}>
            <div className="max-h-full overflow-y-auto rounded-md" onClick={(e) => e.stopPropagation()}>
                <Form onSubmit={editing ? handleWorkoutRecordEdit : handleWorkoutRecordAdd}
                    initialValues={
                        (editing && editableRecord) ? {
                            date: editableRecord.date,
                            timeSpent: editableRecord.timeSpent.toString(),
                            caloriesBurned: editableRecord.caloriesBurned.toString(),
                            distanceCovered: editableRecord.distanceCovered.toString(),
                        }: undefined
                    }>
                    {({ handleSubmit, submitError, submitting, pristine }) => (
                        <form onSubmit={handleSubmit}
                            className='bg-white shadow-md rounded-md px-6 py-8 sm:p-8 flex flex-col'>
                            <h2 className='text-center text-lg font-bold mb-5'>{ editing ? 'Update workout record' : 'Add workout record' }</h2>
                            { submitError && <p className='text-xs text-red-600 mb-3 text-center -mt-3'>{ submitError }</p> }
                            <div className='sm:flex sm:justify-between'>
                                <Field name='date' type='date'>
                                    {({ input }) => (
                                        <label className='sm:mr-5 mb-5 block'>
                                            Date
                                            <input 
                                                {...input}
                                                required
                                                max={new Date().toISOString().split("T")[0]}
                                                className='block outline-none input-style'  />
                                    </label>
                                    )}
                                </Field>
                                <Field name='timeSpent' type='text'
                                    validate={(value) => !isNumeric(value) && 'Value should be number or decimal' }>
                                    {({ input, meta }) => (
                                        <div className='mb-5'>
                                            <label>
                                                Time Spent <span className='text-gray-400 text-xs'>(in hrs)</span>
                                                <input 
                                                    {...input}
                                                    inputMode='numeric'
                                                    className='input-style block' />
                                            </label>
                                            { meta.error && meta.touched && <p className='text-xs max-w-[200px] text-red-600 mt-1'>{ meta.error }</p> }
                                        </div>
                                    )}
                                </Field>
                            </div>
                            <div className='sm:flex sm:justify-between'>
                                <Field name='caloriesBurned' type='text'
                                    validate={(value) => value && value.trim() && !isNumeric(value) && 'Value should be number or decimal' }>
                                    {({ input, meta }) => (
                                        <div className='mb-5 sm:mr-5'>
                                            <label>
                                                Calories Burned <span className='text-gray-400 text-xs'>(in cal)</span>
                                                <input 
                                                    {...input}
                                                    inputMode='decimal'
                                                    className='input-style block' />
                                            </label>
                                            { meta.error && meta.touched && <p className='text-xs max-w-[200px] text-red-600 mt-1'>{ meta.error }</p> }
                                        </div>
                                    )}
                                </Field>

                                <Field name='distanceCovered' type='text'
                                    validate={(value) => value && value.trim() && !isNumeric(value) && 'Value should be number or decimal' }>
                                    {({ input, meta }) => (
                                        <div className='mb-5'>
                                            <label>
                                                Distance Covered <span className='text-gray-400 text-xs'>(in km)</span>
                                                <input 
                                                    {...input}
                                                    inputMode='decimal'                                              
                                                    className='input-style block' />
                                            </label>
                                            { meta.error && meta.touched && <p className='text-xs max-w-[200px] text-red-600 mt-1'>{ meta.error }</p> }
                                        </div>
                                    )}
                                </Field>
                            </div>
                            <div className='flex justify-center'>
                                <button 
                                    type='submit'
                                    disabled={submitting || (editing && pristine)}
                                    className={classNames(`bg-theme hover:bg-themeHover py-2 px-4 w-[80px] text-white rounded-md text-sm 
                                        font-medium'`, editing && pristine && 'opacity-[.6]')}>
                                        { editing ? ( submitting ? '. . .' : 'Update') : (submitting ? '. . .' : 'Add')}
                                    </button>
                                <button 
                                    type='button'
                                    className='py-2 px-4 rounded-md ml-5 hover:bg-gray-100 w-[80px] border-mainBorder border text-sm font-medium'
                                    onClick={closeForm}>Cancel</button>
                            </div>
                        </form>
                    )}
                </Form>
            </div>
        </div>
    )
}

export default WorkoutForm;