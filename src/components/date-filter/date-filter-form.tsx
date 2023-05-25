import type { Props } from "../../model/sleeprecord-filter-form";

const FilterForm = ({ 
  handleSetfilterDates, 
  sortedDate, 
  filterDates, 
  startDateRef, 
  endDateRef, 
  setShowDateFilter, 
  setFilterDates 
}: Props) => {
  return (
    <form onSubmit={handleSetfilterDates}
      className="absolute right-0 top-[80px] xs:top-[40px] md:top-[70px] text-sm font-normal bg-white rounded-lg p-3 shadow-mainShadow">
      <div className="flex flex-col xs:flex-row">
        <label className="flex flex-col mb-4 xs:mb-0 xs:mr-4">
          <span className="text-gray-500">Start date</span>
          <input 
              type="date" 
              required
              defaultValue={filterDates.startDate}
              min={sortedDate[0]}
              max={sortedDate[sortedDate.length - 1]}
              ref={startDateRef}
              name='start date'
              className="p-1 border rounded-[4px] outline-none"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-gray-500">End date</span>
          <input 
              type="date" 
              required
              defaultValue={filterDates.endDate}
              ref={endDateRef}
              min={sortedDate[0]}
              max={sortedDate[sortedDate.length - 1]}
              name='end date'
              className="p-1 border rounded-[4px] outline-none"
          />
        </label>
      </div>
      <div className="flex justify-end mt-5">
        <button 
          type="button"
          onClick={filterDates.endDate ? () => {
            setFilterDates({ startDate: '', endDate: '' });
            setShowDateFilter(false);
          } : () => setShowDateFilter(false)}
          className="py-1 px-2 rounded-md hover:bg-gray-200 text-gray-600">
          { filterDates.endDate ? 'Remove' : 'Cancel' }
        </button>
        <button 
          type="submit"
          className="bg-theme text-white ml-4 py-1 px-2 rounded-md hover:bg-themeHover"
          >Filter
        </button>
      </div>
    </form>
  )
}

export default FilterForm