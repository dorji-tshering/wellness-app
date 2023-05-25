import { useState, useMemo, useEffect, SetStateAction, memo } from 'react';
import classNames from 'classnames';
import Loader from '../loader/loader';
import { useAppSelector } from '../../state/hooks';
import { selectSleepRecords, selectStatus } from '../../state/sleep-record/sleep-record.slice';
import { useAuthValue } from '../../hooks/use-auth-context';
import { useFetch } from '../../hooks/use-fetch';

const SleepStats = memo(({ 
  startDate,
  endDate, 
  setSleepQualityData }: {
    startDate?: string, 
    endDate?: string, 
    setSleepQualityData?: React.Dispatch<SetStateAction<{ Excellent: number, Good: number, Poor: number }>> }
) => {
  const [averageSleephours, setAverageSleephours] = useState(0);
  const fetchStatus = useAppSelector(selectStatus);
  const sleepRecords = useAppSelector(selectSleepRecords);
  const user = useAuthValue();

  const filteredRecords = useMemo(() => {
    if(startDate && endDate) {
      return sleepRecords.filter(record => record.date >= startDate && record.date <= endDate);
    }else {
      return sleepRecords;
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, sleepRecords]);

  useFetch('sleepStats', user, fetchStatus);

 



  if(fetchStatus === 'idle' || fetchStatus === 'pending') {
      return (
          <div className="w-full relative h-[200px]">
              <Loader/>
          </div>
      )
  }

  return (
      <div className='rounded-xl bg-gray-100 p-5 mb-6'>
          { !!filteredRecords.length ? (
              <>
                { startDate && endDate && (
                  <p className='mb-2 text-xs text-theme'>From: 
                    <span className='text-gray-600 ml-1'>{ startDate }</span> to: 
                    <span className='text-gray-600 ml-1'>{ endDate }</span></p>
                ) }
                <p className='mb-2 text-gray-600'>Average sleep hours: <span className='font-bold'>{ averageSleephours } hrs/day</span></p>
                <span className='text-xs text-gray-500'>Your sleep quality</span>
                
                <p className='text-gray-500'>Total records: <span className='font-bold'>{ filteredRecords.length }</span></p>
            </>
          ) : (
              <div>
                  <p className='text-gray-600'>
                      Your sleep stats will show here once you start adding records.
                  </p>
              </div>
          ) }
      </div>
  )
});

export default SleepStats;