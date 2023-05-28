export type Props = {
  endDate?: string
  startDate?: string
  setFilterDates?:  React.Dispatch<React.SetStateAction<{
    startDate: string;
    endDate: string;
  }>>
  setSleepQuality?:  React.Dispatch<React.SetStateAction<number>>
}