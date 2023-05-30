import { FormEvent } from "react";

export type Props = {
  handleSetfilterDates: (event: FormEvent) => void
  sortedDate: (string | undefined)[]
  filterDates: {
    startDate: string
    endDate: string
  }
  startDateRef: React.RefObject<HTMLInputElement>
  endDateRef: React.RefObject<HTMLInputElement>
  setShowDateFilter:React.Dispatch<React.SetStateAction<boolean>>
  setFilterDates: React.Dispatch<React.SetStateAction<{
    startDate: string;
    endDate: string;
  }>>
}