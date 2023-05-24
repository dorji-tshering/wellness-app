import { BiRun, BiSwim, BiCycling, BiFootball } from 'react-icons/bi';
import { FaWalking } from 'react-icons/fa';
import { GiRunningNinja, GiJumpingRope, GiWeightLiftingUp } from 'react-icons/gi';


const WorkoutArray = [
  {
    id: '1',
    name: 'Running',
    caloPerThirtyMins: 300,
    icon: BiRun,
    hasDistanceAttribute: true,
  },
  {
    id: '2',
    name: 'Swimming',
    caloPerThirtyMins: 250,
    icon: BiSwim,
    hasDistanceAttribute: false,
  },
  {
    id: '3',
    name: 'Cycling',
    caloPerThirtyMins: 240,
    icon: BiCycling,
    hasDistanceAttribute: true,
  },
  {
    id: '4',
    name: 'Walking',
    caloPerThirtyMins: 100,
    icon: FaWalking,
    hasDistanceAttribute: true,
  },
  {
    id: '5',
    name: 'Aerobic Dance',
    caloPerThirtyMins: 220,
    icon: GiRunningNinja,
    hasDistanceAttribute: false,
  },
  {
    id: '6',
    name: 'Jumping',
    caloPerThirtyMins: 300,
    icon: GiJumpingRope,
    hasDistanceAttribute: false,
  },
  {
    id: '7',
    name: 'Weight lifting',
    caloPerThirtyMins: 270,
    icon: GiWeightLiftingUp,
    hasDistanceAttribute: false,
  },
  {
    id: '8',
    name: 'Futsal',
    caloPerThirtyMins: 280,
    icon: BiFootball,
    hasDistanceAttribute: false,
  },
];

export const getWorkoutName = (id: string) => {
  const workoutObj = WorkoutArray.find((workout) => workout.id === id);
  if(workoutObj) {
    return workoutObj.name;
  }
}

export const getWorkout = (id: string) => WorkoutArray.find(workout => workout.id === id);

export default WorkoutArray;