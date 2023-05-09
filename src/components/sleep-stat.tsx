import { collection, query, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { database } from '../firebaseClient';
import { useAuthValue } from '../utils/auth-context'; 
import classNames from 'classnames';
import Loader from './loader';
import { SleepQuality } from '../model/sleep-stat';
import { listenDocs } from '../services/facade.service';

const SleepStats = () => {
    const [averageSleephours, setAverageSleephours] = useState(0);
    const [recordLength, setRecordLength] = useState(0);
    const [loadingData, setLoadingData] = useState(true);
    const [sleepQualityData, setSLeepQualityData] = useState<SleepQuality>({
        Excellent: '',
        Good: '',
        Poor: '',
    });
    const user = useAuthValue();

    useEffect(() => {
        if(user) {
            const q = query(collection(database, 'sleeprecords'), where('userId', '==', user.uid));
            const unsubscribe = listenDocs(q, (querySnapshot) => {
                if(querySnapshot.docs.length > 0) {
                    const recordLength = querySnapshot.docs.length;
                    let totalSleephours = 0;
                    const qualityCount: {[index: string]: number} = {
                        Excellent: 0,
                        Good: 0,
                        Poor: 0,
                    }

                    querySnapshot.docs.forEach((record) => {
                        totalSleephours += record.data().sleepTime;
                        qualityCount[record.data().sleepQuality] = qualityCount[record.data().sleepQuality] + 1;
                    });

                    setAverageSleephours(Math.ceil(totalSleephours / recordLength));
                    setRecordLength(recordLength);
                    setSLeepQualityData({
                        Excellent: Math.ceil((qualityCount['Excellent'] / recordLength * 100)).toString(),
                        Good: Math.ceil((qualityCount['Good'] / recordLength * 100)).toString(),
                        Poor: Math.ceil((qualityCount['Poor'] / recordLength * 100)).toString(),
                    });

                    setLoadingData(false);
                }else {
                    setLoadingData(false);
                    return;
                }
            });

            return () => unsubscribe();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(loadingData) {
        return (
            <div className="w-full relative h-[200px]">
                <Loader/>
            </div>
        )
    }

    return (
        <div className='rounded-xl bg-gray-100 p-5 mb-6'>
            { recordLength > 0 ? (
                <>
                    <p className='mb-2 text-gray-600'>Average sleep hours: <span className='font-bold'>{ averageSleephours } hrs/day</span></p>
                    <span className='text-xs text-gray-500'>Your sleep quality</span>
                    <div className='flex flex-wrap'>
                        { Object.keys(sleepQualityData).map((quality, idx) => (
                            <p className={classNames('mr-5 mb-2 font-medium', quality === 'Excellent' && 'text-green-500',
                            quality === 'Good' && 'text-yellow-500', quality === 'Poor' && 'text-red-500')}
                            key={idx}>
                                { quality }: <span>{ sleepQualityData[quality] }%</span>
                            </p>
                        )) }
                    </div>
                    <p className='text-gray-500'>Total records: <span className='font-bold'>{ recordLength }</span></p>
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