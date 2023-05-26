import DesktopPageHeader from "../../components/desktop-page-header/desktop-page-header";
import MobilePageHeader from "../../components/mobile-page-header/mobile-page-header";
import IsMobile from "../../hooks/use-media-query";
import SleepRecordForm from "../../components/sleep-record-form/sleep-record-form";
import { useEffect, useState, useRef, FormEvent } from 'react';
import SleepStats from "../../components/sleep-stat/sleep-stat";
import SleepRecord from "../../components/sleep-record/sleep-record";
import ExcerciseGrid from "../../components/exercise-grid/exercise-grid";
import { fetchSleepRecords, selectSleepRecords, selectStatus } from "../../state/sleep-record/sleep-record.slice";
import { useAuthValue } from "../../hooks/use-auth-context";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import FilterForm from "../../components/date-filter/date-filter-form";

const Wellness = () => {
  const [showSleepRecordForm, setShowSleepRecordForm] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [filterDates, setFilterDates] = useState({
      startDate: '',
      endDate: '',
  });
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const {isMobile} = IsMobile();
  const user = useAuthValue();
  const sleepRecords = useAppSelector(selectSleepRecords);
  const fetchStatus = useAppSelector(selectStatus);
  const dispatch = useAppDispatch();
  const sortedDate = sleepRecords.map(record => record.date).sort();

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

  useEffect(() => {
      if(user && fetchStatus === 'idle') {
        dispatch(fetchSleepRecords(user.uid)).unwrap().catch((err) => {
          console.log(err)
        });
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
      <div>
          { showSleepRecordForm && <SleepRecordForm setShowSleepRecordForm={setShowSleepRecordForm}/> }

          { !isMobile && (
              <DesktopPageHeader>
                  <div className="flex justify-between">
                      <h1 className="text-xl">Wellness</h1>
                      <div>
                          { !!sleepRecords.length && (
                            <button 
                                onClick={() => setShowDateFilter(!showDateFilter)}
                                className="text-sm bg-white rounded-md px-3 py-2 font-medium transition-all duration-300
                                shadow-sm shadow-black/50 mr-3 text-gray-600 hover:text-black hover:bg-gray-100">
                                Date filter
                            </button>
                          ) }
                          <button 
                              onClick={() => setShowSleepRecordForm(true)}
                              className="text-sm bg-theme hover:bg-themeHover text-white rounded-md px-3 py-2 font-medium
                              shadow-sm shadow-black/50 transition-all duration-300">
                              Add sleep record
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
                  <div className="flex justify-between flex-wrap">
                      <h1 className="text-lg mr-2">Wellness</h1>
                      <div className="flex flex-col-reverse xs:flex-row relative">
                          { !!sleepRecords.length && (
                            <button 
                                onClick={() => setShowDateFilter(!showDateFilter)}
                                className="text-sm  font-medium rounded-md px-2 py-1 shadow-sm shadow-black/50
                                whitespace-nowrap text-gray-600 hover:text-black hover:bg-gray-100 
                                transition-all duration-300 mr-0 ml-auto xs:mr-4 mt-3 xs:mt-0">
                                Date filter
                            </button>
                          ) }
                          <button 
                              onClick={() => setShowSleepRecordForm(true)}
                              className="text-sm bg-theme text-white font-medium rounded-md px-2 py-1 shadow-sm shadow-black/50
                              whitespace-nowrap">
                              Add sleep record
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
              <SleepStats startDate={filterDates.startDate} endDate={filterDates.endDate} setFilterDates={setFilterDates} />
              <SleepRecord startDate={filterDates.startDate} endDate={filterDates.endDate} />
              <ExcerciseGrid />
          </div>
      </div>      
  )
}

export default Wellness