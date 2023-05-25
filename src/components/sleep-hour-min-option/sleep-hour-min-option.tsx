import classNames from "classnames";
import { useState } from "react";
import { SleepData } from "../../model/sleep-record-form";

type Props = {
  timeType: 'sleepTime' | 'wakeupTime';
  setShowSleepTimeOption: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeType: React.Dispatch<React.SetStateAction<"sleepTime" | "wakeupTime" | null>>;
  values: SleepData
}

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
  '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '00'] as const;
const MINUTES = Array.from({length: 60}).map((_, idx) => idx <= 9 ? `0${idx}` : `${idx}`);

const SleepHourMinOption = ({ timeType, setShowSleepTimeOption, setTimeType, values }: Props) => {
  const [sleepHour, setSleepHour] = useState<typeof HOURS[number] | null>(null);
  const [sleepMinute, setSleepMinute] = useState<string | null>(null);
  
  const handleTimeSelect = () => {
    if(timeType === 'sleepTime') {
      values.sleepTime = {
        hour: sleepHour as string,
        minute: sleepMinute as string,
      }
    } else {
      values.wakeupTime = {
        hour: sleepHour as string,
        minute: sleepMinute as string,
      }
    }
    setTimeType(null);
    setShowSleepTimeOption(false);
  }

  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-40 flex justify-center items-center px-4 py-5"
      onClick={() => {
        setShowSleepTimeOption(false);
        setTimeType(null);
      }}>
      <div  className="max-h-full overflow-auto rounded-md" onClick={(e) => e.stopPropagation()}>
        <div className='bg-white rounded-md shadow-md px-3 xs:px-8 py-5'>
          <h2 className="text-center">Select { timeType === 'sleepTime' ? 'sleep time' : 'wake up time' }</h2>
          <div className="flex mt-2">
            <div className="flex flex-col max-h-[200px] overflow-y-auto hide-scrollbar grow border-b">
              <p className="text-center sticky top-0 bg-gray-600 text-white text-[10px] py-[3px] mb-1">
                Hour { sleepHour && `: ${sleepHour}` }
              </p>
              { HOURS.map((hour, idx) => (
                <button key={idx}
                  className={classNames('px-5 py-2', 
                  sleepHour === hour ? 'bg-gray-600 text-white' : 'hover:bg-gray-200 bg-gray-100')}
                  onClick={() => setSleepHour(hour)}>
                  { hour }
                </button>
              )) }
            </div>
            <div className="flex flex-col max-h-[200px] overflow-y-auto hide-scrollbar grow border-b">
              <p className="text-center sticky top-0 bg-gray-500 text-white text-[10px] py-[3px] mb-1">
                Minute { sleepMinute && `: ${sleepMinute}` }
              </p>
              { MINUTES.map((minute, idx) => (
                <button key={idx}
                  className={classNames('px-5 py-2', 
                  sleepMinute === minute ? 'bg-gray-500 text-white' : 'hover:bg-gray-200 bg-gray-50')}
                  onClick={() => setSleepMinute(minute)}>
                  { minute }
                </button>
              )) }
            </div>
          </div>
          <div className="mt-3">
            <button 
              type='button'
              className='py-2 px-4 rounded-md mr-5 hover:bg-gray-100 w-[80px] border-mainBorder 
              border text-sm font-medium'
              onClick={() => {
                setShowSleepTimeOption(false);
                setTimeType(null);
              }}>Back
            </button>
            <button 
                type='submit'
                disabled={ (sleepHour && sleepMinute) ? false : true }
                onClick={handleTimeSelect}
                className={classNames(`bg-theme hover:bg-themeHover py-2 px-4 w-[80px] text-white rounded-md 
                text-sm font-medium`, (!sleepHour || !sleepMinute) && 'opacity-50')}>
                Select
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SleepHourMinOption;