import { useState } from 'react';
import isNumeric from '../../utils/is-numeric';
import classNames from 'classnames';
import { useAuthValue } from '../../hooks/use-auth-context';
import { useNotification } from '../../hooks/use-notification-context';
import { Form, Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { Props, SleepData } from '../../model/sleep-record-form';
import { useAppDispatch } from '../../state/hooks';
import { addASleepRecord } from '../../state/sleep-record/sleep-record.slice';
import SleepHourMinOption from '../sleep-hour-min-option/sleep-hour-min-option';

const SleepRecordForm = ({ setShowSleepRecordForm }: Props) => {
  const [showSleepQualities, setShowSleepQualities] = useState(false);
  const [timeType, setTimeType] = useState<'sleepTime' | 'wakeupTime' | null>(null);
  const [showSleepTimeOption, setShowSleepTimeOption] = useState(false);
  const user = useAuthValue();
  const setNotification = useNotification()?.setNotification;
  const sleepQualities = ['Excellent', 'Good', 'Poor'] as const;
  const dispatch = useAppDispatch();

  const handleSleepRecordAdd = async(values: SleepData) => {
      console.log(values)
      // try {
      //     user && await dispatch(addASleepRecord({
      //         userId: user.uid,
      //         values,
      //     }));
      //     setShowSleepRecordForm(false);
      //     setNotification &&  setNotification('Your record has been added successfully.');
      // }catch(err: any) {
      //     return { [FORM_ERROR]: err.code }
      // }
  }

  return (
    <div className='fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-30 flex justify-center items-center px-4 py-5'
      onClick={() => setShowSleepRecordForm(false)}>
      <div className="max-h-full overflow-auto rounded-md" onClick={(e) => e.stopPropagation()}>
        <Form onSubmit={handleSleepRecordAdd}
          validate={(values) => {
            const { sleepTime, wakeupTime } = values;
            const errors: {sleepTime?: string, sleepQuality?: string} = {};
            
            return errors;
          }}>
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
                        className='block outline-none input-style min-w-[150px] w-full' />
                    </label>
                  )}
                </Field>
                <div className='mb-5 min-w-[150px]'>
                  <Field name='sleepTime' type='text'>
                    {({ meta }) => (
                      <>
                        <p>Sleep time</p>
                        <button type='button'
                          className={classNames('px-3 py-1 border border-mainBorder rounded-[4px] w-full',
                          values.sleepTime ? 'text-left' : 'text-gray-400')}
                          onClick={() => {
                            setTimeType('sleepTime');
                            setShowSleepTimeOption(true);
                          }}>
                          { values.sleepTime ? (
                            <>
                              <span>{ values.sleepTime.hour }</span>: <span>{ values.sleepTime.minute }</span>
                            </>
                          ) : '--sleep time--' }
                        </button>
                        { meta.error && meta.touched && (<span className='max-w-[200px] block mt-1 text-xs text-red-600'>
                            { meta.error }
                            </span>
                        ) }
                      </>
                    )}
                  </Field>
                </div>
                <div className='mb-5 min-w-[150px]'>
                  <Field name='wakeupTime' type='text'>
                    {({ meta }) => (
                      <>
                        <p>Wakeup time</p>
                        <button type='button'
                          className={classNames('px-3 py-1 border border-mainBorder rounded-[4px] w-full',
                          values.wakeupTime ? 'text-left' : 'text-gray-400')}
                          onClick={() => {
                            setTimeType('wakeupTime');
                            setShowSleepTimeOption(true);
                          }}>
                          { values.wakeupTime ? (
                            <>
                              <span>{ values.wakeupTime.hour }</span>: <span>{ values.wakeupTime.minute }</span>
                            </>
                          ) : '--wakeup time--' }
                        </button>
                        { meta.error && meta.touched && (<span className='max-w-[200px] block mt-1 text-xs text-red-600'>
                            { meta.error }
                            </span>
                        ) }
                      </>
                    )}
                  </Field>
                </div>
                <div className='flex justify-center'>
                  <button 
                    type='button'
                    className='py-2 px-4 rounded-md mr-5 hover:bg-gray-100 w-[80px] border-mainBorder 
                    border text-sm font-medium'
                    onClick={() => setShowSleepRecordForm(false)}>Cancel
                  </button>
                  <button 
                      type='submit'
                      className='bg-theme hover:bg-themeHover py-2 px-4 w-[80px] text-white rounded-md text-sm font-medium'>
                      { submitting ? '. . .' : 'Add'}
                  </button>
                </div>
              </form>

              {/* time option */}
              { showSleepTimeOption && (
                <SleepHourMinOption
                  values={values}
                  timeType={timeType as 'sleepTime' | 'wakeupTime'}
                  setShowSleepTimeOption={setShowSleepTimeOption}
                  setTimeType={setTimeType}
                />
              ) }
            </>
          )}
        </Form>
      </div>
    </div>
  )
}

export default SleepRecordForm;