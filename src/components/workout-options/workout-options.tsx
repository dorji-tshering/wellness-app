import { useState } from "react";
import WorkoutArray, { getWorkoutName } from "../../utils/workout-options";
import { FormData } from "../../model/workout-form";
import classNames from "classnames";

interface Props {
  setShowWorkoutOptions: React.Dispatch<React.SetStateAction<boolean>>
  values: FormData
}

const WorkoutOptions = ({ values, setShowWorkoutOptions }: Props) => {
  const [workoutIDs, setWorkoutIds] = useState<Array<string>>(values.workoutIDs ?? []);

  const handleSetWorkoutIds = () => {
    values.workouts = []; // clear existing workouts
    values.workoutIDs = workoutIDs;
    workoutIDs.forEach(workoutId => {
      if(values.workouts) {
        values.workouts = [...values.workouts, {workoutId, workoutName: getWorkoutName(workoutId) as string}];
      } else {
        values.workouts = [{workoutId, workoutName: getWorkoutName(workoutId) as string}];
      }
    });
    setShowWorkoutOptions(false);
  }

  const toggleOptions = (workoutId: string) => {
    if(workoutIDs.includes(workoutId)) {
      setWorkoutIds(workoutIDs.filter(id => id !== workoutId));
    } else {
      setWorkoutIds([...workoutIDs, workoutId]);
    }
  }

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center
      px-2 py-5 xs:p-5 bg-black/30 z-40'
      onClick={() => setShowWorkoutOptions(false)}>
      <div className="max-h-full overflow-y-auto rounded-md" onClick={(e) => e.stopPropagation()}>
        <div className='bg-white shadow-md rounded-md px-6 py-8 sm:p-8 flex flex-col'>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            { WorkoutArray.map((workout, idx) => {
              const Icon = workout.icon;
              return (
                <button className={classNames('border rounded-md flex flex-col items-center p-3',
                  workoutIDs.includes(workout.id) ? 'bg-theme text-white' : 'bg-transparent')}
                  onClick={() => toggleOptions(workout.id)}
                  type="button"
                  key={idx}>
                  <div>
                    <Icon size={22} color={workoutIDs.includes(workout.id) ? '#fffddd' : '#666666'}/>
                  </div>
                  <p>{ workout.name }</p>
                  <p className={classNames('text-[10px]', workoutIDs.includes(workout.id) ? 'text-white/80' : 'text-gray-600')}>
                    { workout.caloPerThirtyMins } cal/30 mins
                  </p>
                </button>
              )
            }) }
          </div>
          <div className="flex justify-center mt-5">
            <button className="px-4 py-2 mr-3 rounded-[4px] border border-mainBorder hover:bg-gray-200"
              type="button"
              onClick={() => setShowWorkoutOptions(false)}>
              Back
            </button>
            <button className="px-4 py-2 bg-theme text-white hover:bg-themeHover rounded-[4px]"
              type="button"
              onClick={handleSetWorkoutIds}>
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkoutOptions;