import { useState, useMemo } from 'react';
import classNames from 'classnames';
import Loader from './loader';
import { useAppSelector } from '../state/hooks';
import { selectSleepRecords, selectStatus } from '../state/sleep-record/sleep-record.slice';

const SleepStats = () => {
    const [averageSleephours, setAverageSleephours] = useState(0);
    const fetchStatus = useAppSelector(selectStatus);
    const sleepRecords = useAppSelector(selectSleepRecords);

    const sleepQualityData = useMemo(() => {
        if(sleepRecords.length > 0) {
            const recordLength = sleepRecords.length;
            let totalSleephours = 0;
            const qualityCount: {[index: string]: number} = {
                Excellent: 0,
                Good: 0,
                Poor: 0,
            }
    
            sleepRecords.forEach((record) => {
                totalSleephours += record.sleepTime;
                if(record.sleepQuality) {
                    qualityCount[record.sleepQuality] = qualityCount[record.sleepQuality] + 1;
                }
            });
    
            setAverageSleephours(Math.ceil(totalSleephours / recordLength));
            return {
                Excellent: Math.ceil((qualityCount['Excellent'] / recordLength * 100)).toString(),
                Good: Math.ceil((qualityCount['Good'] / recordLength * 100)).toString(),
                Poor: Math.ceil((qualityCount['Poor'] / recordLength * 100)).toString(),
            } as {[index: string]: string};
        }
    }, [sleepRecords]);

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
                    <p className='text-gray-500'>Total records: <span className='font-bold'>{ sleepRecords.length }</span></p>
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
}

export default SleepStats