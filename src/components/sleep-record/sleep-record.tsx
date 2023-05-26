import { useMemo, useState } from "react";
import Loader from "../loader/loader";
import { useAppSelector } from "../../state/hooks";
import { selectSleepRecords, selectStatus } from "../../state/sleep-record/sleep-record.slice";

const SleepRecord = ({ startDate, endDate }: {startDate: string, endDate: string}) => {
    const [showRecordTable, setShowRecordTable] = useState(true);
    const fetchStatus = useAppSelector(selectStatus);
    const sleepRecords = useAppSelector(selectSleepRecords);

    const filteredRecords = useMemo(() => {
      if(startDate && endDate) {
        return sleepRecords.filter(record => {
          return record.date >= startDate && record.date <= endDate;
        });
      }else {
        return sleepRecords;
      } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, sleepRecords]);

    if(fetchStatus === 'idle' || fetchStatus === 'pending') {
        return (
            <div className="w-full relative h-[200px]">
                <Loader/>
            </div>
        )
    }

    return (
        <>
            { filteredRecords.length > 0 && (
                <div>
                    <button className="block text-gray-600 font-medium mb-6 hover:text-theme hover:underline"
                        onClick={() => setShowRecordTable(!showRecordTable)}>{ showRecordTable ? 'Hide record' : 'View record' }
                    </button>
                    { showRecordTable && (
                        <>
                          <div className="sm:max-w-full xl:max-w-[80%] flex flex-col border border-mainBorder rounded-md
                              mb-8">
                              <div className="hidden sm:grid sm:grid-cols-5 border-b border-b-mainBorder bg-gray-100 
                                  rounded-tr-md rounded-tl-md">
                                  <p className="border-r border-r-mainBorder px-3 py-2 font-bold text-gray-600
                                      flex items-center text-[13px]">
                                      Date
                                  </p>
                                  <p className="border-r border-r-mainBorder px-3 py-2 font-bold text-gray-600
                                      flex items-center text-[13px]">
                                      Time of sleep
                                    </p>
                                  <p className="border-r border-r-mainBorder px-3 py-2 font-bold text-gray-600
                                      flex items-center text-[13px]">
                                    Wake up time
                                  </p>
                                  <p className="border-r border-r-mainBorder px-3 py-2 font-bold text-gray-600
                                      flex items-center text-[13px]">
                                    Duration
                                    <span className="text-[13px] text-gray-500 pl-[2px]">(HRS)</span>
                                  </p>
                                  <p className="px-3 py-2 font-bold text-gray-600 flex items-center text-[13px]">
                                    Quality 
                                  </p>
                              </div>
                              { filteredRecords.map((record, idx) => (
                                  <div className="flex flex-col sm:grid sm:grid-cols-5 border-b border-b-black 
                                      sm:border-b-mainBorder last:border-b-0 text-sm text-gray-600"
                                      key={idx}>
                                      <div className="flex justify-between sm:block px-3 py-2 border-r border-r-mainBorder
                                          border-b border-b-mainBorder sm:border-b-0">
                                          <span className="sm:hidden font-medium text-gray-800">Date</span>
                                          <span className="text-gray-800 sm:text-inherit">{ record.date }</span>
                                      </div>
                                      <div className="flex justify-between sm:block px-3 py-2 border-r border-r-mainBorder
                                          border-b border-b-mainBorder sm:border-b-0">
                                          <span className="sm:hidden font-medium">
                                              Time of sleep
                                          </span>
                                          <span className="text-gray-500 sm:text-inherit">
                                            { record.sleepTime.hour + ':' + record.sleepTime.minute }
                                          </span>
                                      </div>
                                      <div className="flex justify-between sm:block px-3 py-2 border-r border-r-mainBorder
                                          border-b border-b-mainBorder sm:border-b-0">
                                          <span className="sm:hidden font-medium">
                                              Wake up time
                                          </span>
                                          <span className="text-gray-500 sm:text-inherit">
                                            { record.wakeupTime.hour + ':' + record.wakeupTime.minute }
                                          </span>
                                      </div>
                                      <div className="flex justify-between sm:block px-3 py-2 border-r border-r-mainBorder
                                          border-b border-b-mainBorder sm:border-b-0">
                                          <span className="sm:hidden font-medium">
                                              Duration
                                              <span className="text-xs text-gray-500 pl-[2px]">(HRS)</span>
                                          </span>
                                          <span className="text-gray-500 sm:text-inherit">
                                            { record.duration }
                                          </span>
                                      </div>
                                      <div className="flex justify-between sm:block px-3 py-2">
                                          <span className="sm:hidden font-medium">Quality</span>
                                          <span className="text-gray-500 sm:text-inherit">{ record.quality }</span>
                                      </div>
                                  </div>
                              )) }
                          </div>
                        </>
                    ) }
                </div>
            ) }
        </>
    )
}

export default SleepRecord;