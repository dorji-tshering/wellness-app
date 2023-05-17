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

  const sleepQualityData = useMemo(() => {
      if(filteredRecords.length > 0) {
          const recordLength = filteredRecords.length;
          let totalSleephours = 0;
          const qualityCount: {[index: string]: number} = {
              Excellent: 0,
              Good: 0,
              Poor: 0,
          }
  
          filteredRecords.forEach((record) => {
              totalSleephours += record.sleepTime;
              if(record.sleepQuality) {
                  qualityCount[record.sleepQuality] = qualityCount[record.sleepQuality] + 1;
              }
          });
  
          setAverageSleephours(Math.ceil(totalSleephours / recordLength));
          return {
              Excellent: Math.ceil((qualityCount['Excellent'] / recordLength * 100)),
              Good: Math.ceil((qualityCount['Good'] / recordLength * 100)),
              Poor: Math.ceil((qualityCount['Poor'] / recordLength * 100)),
          };
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRecords]);

  useEffect(() => {
    sleepQualityData && setSleepQualityData && setSleepQualityData(sleepQualityData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[filteredRecords]);

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
                <div className='flex flex-wrap'>
                    { sleepQualityData && Object.entries(sleepQualityData).map(([quality, percentValue], idx) => (
                        <p className={classNames('mr-5 mb-2 font-medium', quality === 'Excellent' && 'text-green-500',
                        quality === 'Good' && 'text-yellow-500', quality === 'Poor' && 'text-red-500')}
                        key={idx}>
                            { quality }: <span>{ percentValue }%</span>
                        </p>
                    )) }
                </div>
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