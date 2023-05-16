import { User } from "firebase/auth";

export type FetchType = 'workoutStats' | 'nutrientStats' | 'sleepStats';
export type CurrentUser = User | null;
export type Status = "idle" | "pending" | "succeeded" | "failed";