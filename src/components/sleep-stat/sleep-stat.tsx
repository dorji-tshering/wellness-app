import { useMemo, memo } from 'react';
import Loader from '../loader/loader';
import { useAppSelector } from '../../state/hooks';
import { selectSleepRecords, selectStatus } from '../../state/sleep-record/sleep-record.slice';
import { useAuthValue } from '../../hooks/use-auth-context';
import { useFetch } from '../../hooks/use-fetch';
import { Props } from '../../model/sleep-stat';

const getAverageTime = (
  totalHour: number, 
  totalMinute: number,
  recordLength: number) => {
  let averageHour: number;
  let averageMinute: number;
  let flag = true;

  // while(flag) {
  //   if(totalHour % recordLength !== 0) {
  //     totalHour += 1;
  //     totalMinute -= 60;
  //   } else {
  //     flag = false;
  //   }
  // }

  averageHour = (totalHour / recordLength) - 1;
  averageMinute = (totalMinute / recordLength) + 60;

  if(averageMinute >= 60) {
    averageHour += Math.floor(averageMinute / 60);
    averageMinute = averageMinute % 60;
  }

  return `${averageHour < 10 ? '0' + averageHour : averageHour }:${averageMinute < 10 ? '0' + Math.ceil(averageMinute)
    : Math.ceil(averageMinute)}`;
}

const SleepStats = memo(({ startDate, endDate, setFilterDates }: Props) => {
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

  const sleepStats = useMemo(() => {
    let totalSleepDuration = 0;
    const qualityCount: {[index: string]: number} = {
      Excellent: 0,
      Good: 0,
      Poor: 0,
    } 
    let totalSleepHour = 0;
    let totalWakeupHour = 0;
    let totalSleepMinute = 0;
    let totalWakeupMinute = 0;

    filteredRecords.forEach(record => {
      totalSleepDuration += record.duration;
      qualityCount[record.quality] = qualityCount[record.quality] + 1;

      if(record.sleepTime.hour === '00') {
        totalSleepHour += 24;
      }else {
        totalSleepHour += Number(record.sleepTime.hour);
      }

      if(record.wakeupTime.hour === '00') {
        totalWakeupHour += 24;
      }else {
        totalWakeupHour += Number(record.wakeupTime.hour);
      }
      totalSleepMinute += Number(record.sleepTime.minute);
      totalWakeupMinute += Number(record.wakeupTime.minute);
    });

    const averageSleepTime = getAverageTime(totalSleepHour, totalSleepMinute, filteredRecords.length);
    const averageWakeupTime = getAverageTime(totalWakeupHour, totalWakeupMinute, filteredRecords.length);

    return {
      averageSleephours: (totalSleepDuration / filteredRecords.length).toPrecision(2),
      sleepQuality: {
        Excellent: Math.ceil((qualityCount['Excellent'] / filteredRecords.length * 100)),
        Good: Math.ceil((qualityCount['Good'] / filteredRecords.length * 100)),
        Poor: Math.ceil((qualityCount['Poor'] / filteredRecords.length * 100)),
      },
      averageSleepTime,
      averageWakeupTime, 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRecords]);

  console.log(sleepStats)

  if(fetchStatus === 'idle' || fetchStatus === 'pending') {
      return (
          <div className="w-full relative h-[200px]">
              <Loader/>
          </div>
      )
  }

  return (
      <div className='rounded-xl bg-gray-100 p-5 mb-6'>
          { !!sleepRecords.length ? (
              <>
                { startDate && endDate && setFilterDates && (
                  <div className="flex mb-4 items-center text-sm">
                    <p className='text-theme'>From: 
                      <span className='text-gray-600 ml-1'>{ startDate }</span> to: 
                      <span className='text-gray-600 ml-1'>{ endDate }</span>
                    </p>
                    <button onClick={() => setFilterDates({startDate: '', endDate: ''})}
                      className="text-theme underline ml-4">
                      Remove filter
                    </button>
                  </div>
                ) }
                { !!filteredRecords.length ? (
                  <div>
                    <p className='mb-2 text-gray-600'>
                      Average sleep hours: 
                      <span className='font-bold ml-2'>
                        { sleepStats.averageSleephours } hrs/day
                      </span>
                    </p>
                    <div>
                      <span className='text-xs text-gray-500'>Your sleep quality</span>
                      <p>
                        <span className='mr-4'>
                          Excellent: { sleepStats.sleepQuality.Excellent }%
                        </span>
                        <span className='mr-4'>
                          Good: { sleepStats.sleepQuality.Good }%
                        </span>
                        <span>
                          Poor: { sleepStats.sleepQuality.Poor }%
                        </span>
                      </p>
                    </div>
                    <p>Average time of sleep: <span>{ sleepStats.averageSleepTime }</span></p>
                    <p>Average wake up time: <span>{ sleepStats.averageWakeupTime }</span></p>
                    <p className='text-gray-500'>Total records: <span className='font-bold'>{ filteredRecords.length }</span></p>
                  </div>
                ) : (
                  <div className="flex flex-wrap">
                    <p className="text-gray-600">No records to show for this filter.</p>
                  </div>
                )}
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