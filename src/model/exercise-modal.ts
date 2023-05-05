import { SetStateAction } from "react";

export type Props = {
    exerciseId: string
    setExerciseId: React.Dispatch<SetStateAction<string>>
}