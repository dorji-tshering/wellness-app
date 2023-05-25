import isNumeric from '../../utils/is-numeric';
import { useAuthValue } from '../../hooks/use-auth-context';
import { useNotification } from '../../hooks/use-notification-context';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import classNames from 'classnames';
import { WorkoutRecord, Props,  } from '../../model/workout-form';
import { createWorkoutRecord, editWorkoutRecord } from '../../services/facade.service';
import { useAppDispatch } from '../../state/hooks';
import { addWorkoutRecord, updateWorkoutRecord } from '../../state/workout-stats/workout-stat.slice';
import { useState } from 'react';
import { getWorkout, getWorkoutName } from '../../utils/workout-options';
import WorkoutOptions from '../workout-options/workout-options';
import React from 'react';

const WorkoutForm = ({ 
  setShowForm, 
  setEditMode, 
  setRecordId, 
  editing, 
  recordId, 
  editableRecord, 
  setEditableRecord }: Props
) => {
    const [showWorkoutOptions, setShowWorkoutOptions] = useState(false);
    const user = useAuthValue();
    const setNotification = useNotification()?.setNotification;
    const dispatch = useAppDispatch();

    const handleWorkoutRecordAdd = async(values: WorkoutRecord) => {
        try {
            const recordId = user && await createWorkoutRecord(user.uid, values);
            recordId && dispatch(addWorkoutRecord({
              recordId,
              newRecord: values,
            }));
            setNotification && setNotification('Record added successfully.');
            setShowForm(false);
        }catch(err: any) {
            return { [FORM_ERROR]: err.code };
        }
    }

    const handleWorkoutRecordEdit = async(values: WorkoutRecord) => {
        try {
            recordId && await editWorkoutRecord(recordId, values);
            dispatch(updateWorkoutRecord({
              recordId: recordId as string,
              updatedRecord: values,
            }));
            setNotification && setNotification('Record updated successfully.');
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
                          workoutIDs: editableRecord.workoutIDs,
                          workouts: editableRecord.workouts,
                      }: undefined
                    }
                    validate={values => {
                      const errors: {workoutIds?: string} = {};
                      if(!values.workouts || values.workouts.length === 0) {
                        errors.workoutIds = 'Atealst a workout is required';
                      }
                      return errors;
                    }}>
                    {({ values, handleSubmit, submitError, submitting, pristine }) => (
                        <form onSubmit={handleSubmit}
                            className='bg-white shadow-md rounded-md px-6 py-8 sm:p-8 flex flex-col'>
                            <h2 className='text-center text-lg font-bold mb-5'>{ editing ? 'Update workout record' : 'Add workout record' }</h2>
                            { submitError && <p className='text-xs text-red-600 mb-3 text-center -mt-3'>{ submitError }</p> }
                            <div className='grid sm:grid-cols-2 [&>*:nth-child(odd)]:sm:mr-5 [&>*]:mb-5'>
                              <Field name='date' type='date'>
                                {({ input }) => (
                                  <label>
                                    Date
                                    <input 
                                        {...input}
                                        required
                                        max={new Date().toISOString().split("T")[0]}
                                        className='block outline-none input-style'  />
                                  </label>
                                )}
                              </Field>
                              <Field name='workoutIds'>
                                {({ meta }) => (
                                  <div>
                                    <p>Workouts</p>
                                    <p className={classNames(`border flex border-mainBorder rounded-[4px] px-3 py-1 cursor-pointer
                                      overflow-x-auto max-w-[200px] hide-scrollbar`,
                                      !values.workoutIDs && 'text-gray-400')}
                                      onClick={() => setShowWorkoutOptions(true)}>
                                      { values.workoutIDs && !!values.workoutIDs.length ? (
                                        values.workoutIDs.map((workoutId, idx) => (
                                          <span className='whitespace-nowrap mr-2 underline' key={idx}>
                                            { getWorkoutName(workoutId) }
                                          </span>
                                        ))
                                      ) : '--select workouts--' }
                                    </p>
                                    { meta.error && meta.touched && <p className='text-xs max-w-[200px] text-red-600 mt-1'>{ meta.error }</p> }
                                  </div>
                                )}
                              </Field>
                              {/* dynamically show time and distance input fields */}
                              { values.workouts && values.workouts.map((workout, idx) => (
                                <React.Fragment key={idx}>
                                  <Field name={`workouts[${idx}].timeSpent`} type='text'
                                    validate={(value) => !isNumeric(value) && 'Value should be number or decimal' }>
                                    {({ input, meta }) => (
                                      <div>
                                          <label>
                                              Time Spent <span className='text-gray-400 text-xs'>(in mins)</span>
                                              <input 
                                                  {...input}
                                                  inputMode='numeric'
                                                  placeholder={`For ${workout.workoutName}`}
                                                  className='input-style block' />
                                          </label>
                                          { meta.error && meta.touched && <p className='text-xs max-w-[200px] text-red-600 mt-1'>{ meta.error }</p> }
                                      </div>
                                    )}
                                  </Field>
                                  { getWorkout(workout.workoutId) && getWorkout(workout.workoutId)?.hasDistanceAttribute && (
                                    <Field name={`workouts[${idx}].distanceCovered`} type='text'
                                      validate={(value) => !isNumeric(value) && 'Value should be number or decimal' }>
                                      {({ input, meta }) => (
                                        <div>
                                            <label>
                                                Distance Covered <span className='text-gray-400 text-xs'>(in m)</span>
                                                <input 
                                                    {...input}
                                                    inputMode='decimal'  
                                                    placeholder={`For ${workout.workoutName}`}                                           
                                                    className='input-style block' />
                                            </label>
                                            { meta.error && meta.touched && <p className='text-xs max-w-[200px] text-red-600 mt-1'>{ meta.error }</p> }
                                        </div>
                                      )}
                                    </Field>
                                  ) }
                                </React.Fragment>
                              )) }

                              
                              
                              
                            </div>
                            <div className='flex justify-center'>
                              <button 
                                type='button'
                                className='py-2 px-4 rounded-md mr-5 hover:bg-gray-100 w-[80px] border-mainBorder border text-sm font-medium'
                                onClick={closeForm}>Cancel
                              </button>
                              <button 
                                type='submit'
                                disabled={submitting || (editing && pristine)}
                                className={classNames(`bg-theme hover:bg-themeHover py-2 px-4 w-[80px] text-white rounded-md text-sm 
                                font-medium'`, editing && pristine && 'opacity-[.6]')}>
                                { editing ? ( submitting ? '. . .' : 'Update') : (submitting ? '. . .' : 'Add')}
                              </button>
                            </div>
                            { showWorkoutOptions && <WorkoutOptions values={values} setShowWorkoutOptions={setShowWorkoutOptions}/> }
                        </form>
                    )}
                </Form>
            </div>
        </div>
    )
}

export default WorkoutForm;