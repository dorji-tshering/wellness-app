import { FormEvent, useRef, useState } from "react";
import DesktopPageHeader from "../../components/desktop-page-header/desktop-page-header";
import MobilePageHeader from "../../components/mobile-page-header/mobile-page-header";
import IsMobile from "../../hooks/use-media-query";
import WorkoutForm from "../../components/workout-form/workout-form";
import WorkoutStatAndTable from "../../components/workout-stat-and-table/workout-stat-and-table";
import { ErrorBoundary } from "react-error-boundary";
import { WorkoutRecord } from "../../model/workout-form";
import { useAppSelector } from "../../state/hooks";
import { selectRecords } from "../../state/workout-stats/workout-stat.slice";
import FilterForm from "../../components/date-filter/date-filter-form";

const Fitness = () => {
  const {isMobile} = IsMobile();
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [recordId, setRecordId] = useState('');
  const [editableRecord, setEditableRecord] = useState<WorkoutRecord & {id: string} | null>(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const [filterDates, setFilterDates] = useState({
    startDate: '',
    endDate: '',
  });

  const workoutRecords = useAppSelector(selectRecords);
  const sortedDate = workoutRecords.map(record => record.date).sort();

  const handleSetfilterDates = (event: FormEvent) => {
    event.preventDefault();
    if(startDateRef.current && endDateRef.current) {
      if(startDateRef.current.value > endDateRef.current.value) {
        alert("Start date can't be greater than end date.");
        return;
      }
      setFilterDates({
          startDate: startDateRef.current.value,
          endDate: endDateRef.current.value,
      });
    }
    setShowDateFilter(false);
}

  return (
      <div>
          { showWorkoutForm && 
              <WorkoutForm 
                  setShowForm={setShowWorkoutForm} 
                  setEditMode={setEditMode}
                  setRecordId={setRecordId}
                  editing={editMode ? true : false} 
                  recordId={recordId}
                  editableRecord={editableRecord}
                  setEditableRecord={setEditableRecord}/> }

          { !isMobile && (
              <DesktopPageHeader>
                  <div className="flex justify-between">
                      <h1 className="text-xl">My Fitness</h1>
                      <div>
                        { !!workoutRecords.length && (
                          <button 
                            onClick={() => setShowDateFilter(!showDateFilter)}
                            className="text-sm bg-white rounded-md px-3 py-2 font-medium transition-all duration-300
                            shadow-sm shadow-black/50 mr-3 text-gray-600 hover:text-black hover:bg-gray-100">
                            Date filter
                          </button>
                        ) }
                        <button 
                            onClick={() => setShowWorkoutForm(true)}
                            className="text-sm bg-theme hover:bg-themeHover text-white rounded-md px-3 py-2 font-medium
                            shadow-sm shadow-black/50">
                            Add workout
                        </button>
                        { showDateFilter && (
                                <FilterForm
                                  handleSetfilterDates={handleSetfilterDates}
                                  sortedDate={sortedDate}
                                  filterDates={filterDates}
                                  startDateRef={startDateRef}
                                  endDateRef={endDateRef}
                                  setShowDateFilter={setShowDateFilter} 
                                  setFilterDates={setFilterDates}
                                />
                        ) }
                      </div>
                  </div>
              </DesktopPageHeader>
          ) }

          { isMobile && (
              <MobilePageHeader> 
                  <div className="flex justify-between">
                      <h1 className="lg">My Fitness</h1>
                      <div className="flex flex-col-reverse xs:flex-row relative">
                        { !!workoutRecords.length && (
                          <button 
                            onClick={() => setShowDateFilter(!showDateFilter)}
                            className="text-sm  font-medium rounded-md px-2 py-1 shadow-sm shadow-black/50
                            whitespace-nowrap text-gray-600 hover:text-black hover:bg-gray-100 
                            transition-all duration-300 mr-0 ml-auto xs:mr-4 mt-3 xs:mt-0">
                            Date filter
                          </button>
                        ) }
                        <button 
                            onClick={() => setShowWorkoutForm(true)}
                            className="text-sm bg-theme text-white font-medium rounded-md px-2 py-1 shadow-sm shadow-black/50">
                            Add workout
                        </button>
                        { showDateFilter && (
                          <FilterForm
                            handleSetfilterDates={handleSetfilterDates}
                            sortedDate={sortedDate}
                            filterDates={filterDates}
                            startDateRef={startDateRef}
                            endDateRef={endDateRef}
                            setShowDateFilter={setShowDateFilter} 
                            setFilterDates={setFilterDates}
                          />
                        ) }
                      </div>
                  </div>
              </MobilePageHeader>
          ) }

          <div>
              <ErrorBoundary fallback={<div>Something went wrong</div>}>
                  <WorkoutStatAndTable 
                      setEditMode={setEditMode} 
                      setShowWorkoutForm={setShowWorkoutForm} 
                      setRecordId={setRecordId}
                      setEditableRecord={setEditableRecord}
                      startDate={filterDates.startDate}
                      endDate={filterDates.endDate}
                      setFilterDates={setFilterDates}/>
              </ErrorBoundary>
          </div>
      </div>
  )
}

export default Fitness;