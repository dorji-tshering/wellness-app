export type Props = {
    setShowSleepRecordForm: React.Dispatch<React.SetStateAction<boolean>>
}

export type SleepData = {
    date: string
    sleepTime: {
      hour: string
      minute: string
    }
    wakeupTime: {
      hour: string
      minute: string
    }
    duration: number
    quality: string
}