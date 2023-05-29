import { GiTimeBomb, GiAtomCore, GiPathDistance } from "react-icons/gi";
import { getWorkoutName } from "../../utils/workout-options";
import { Props } from "../../model/workout-stat";

const WorkoutStats = ({ workoutStats }: Props) => {
  return (
    workoutStats ? (
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xs:max-w-[70%] 
      sm:max-w-full xl:max-w-[80%] mx-auto mt-10 justify-between ">
      <div className="flex flex-col justify-center items-center py-6 rounded-md bg-[#67079F]/5
          mb-10 sm:basis-[30%] md:basis-full lg:basis-[30%]">
          <p className="mb-3"><GiTimeBomb size={30} color="#67079F"/></p>
          <p className="">Time Spent</p>
          <span className="mb-5 text-gray-500">(min)</span>
          <div className="text-[#612881] w-full">
            { Object.entries(workoutStats.timeSpent).map((timeStats, idx) => (
              <p key={idx}
                className="flex">
                <span className="basis-1/2 text-right mr-2">{ getWorkoutName(timeStats[0]) }</span>: 
                <span className="basis-1/2 text-left ml-2">{timeStats[1]}</span>
              </p>
            )) }
          </div>
      </div>
      <div className="flex flex-col justify-between items-center py-6 rounded-md bg-[#F2A90D]/5
          mb-10 sm:basis-[30%] md:basis-full lg:basis-[30%]">
          <p className="mb-3"><GiAtomCore size={30} color="#F2A90D"/></p>
          <p className="">Calories Burned</p>
          <span className="mb-5 text-gray-500">(cal)</span>
          <div className="text-[#866828] w-full">
            { Object.entries(workoutStats.caloriesBurned).map((calorieStat, idx) => (
              <p key={idx}
                className="flex">
                <span className="basis-1/2 text-right mr-2">{ getWorkoutName(calorieStat[0]) }</span>: 
                <span className="basis-1/2 text-left ml-2">{calorieStat[1]}</span>
              </p>                                  
            )) }
          </div>
      </div>
      <div className="flex flex-col justify-between items-center py-6 rounded-md bg-[#1CC115]/5
      mb-10 sm:basis-[30%] md:basis-full lg:basis-[30%]">
          <p className="mb-3"><GiPathDistance size={30} color="#1CC115"/></p>
          <p className="">Distance Covered</p>
          <span className="mb-5 text-gray-500">(m)</span>
          <div className="text-[#257023] w-full">
            { Object.entries(workoutStats.distanceCovered).map((distanceStats, idx) => (
              <p key={idx}
                className="flex">
                <span className="basis-1/2 text-right mr-2">{ getWorkoutName(distanceStats[0]) }</span>: 
                <span className="basis-1/2 text-left ml-2">{ isNaN(distanceStats[1]) ? 
                  'NaN' : distanceStats[1] }
                </span>
              </p>                                  
            )) }
          </div>
      </div>
      </div>
    ) : (
      <div className="p-5 mb-10 rounded-xl bg-yellow-50">
        <p>Your workout stats will show here once you start adding records.</p>
      </div>
    )
  )
}

export default WorkoutStats;