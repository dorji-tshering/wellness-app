export type Props = {
  workoutStats?: {
    timeSpent: { [key: string]: number };
    distanceCovered: { [key: string]: number };
    caloriesBurned: { [key: string]: number };
  }
}