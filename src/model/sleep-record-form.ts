export type Props = {
    setShowSleepRecordForm: React.Dispatch<React.SetStateAction<boolean>>
}

export type SleepData = {
    date: string
    sleepTime: string
    sleepQuality: 'Excellent' | 'Good' | 'Poor' | null
}