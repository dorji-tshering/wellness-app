import { useState } from "react";
import ExcerciseModal from "../exercise-modal/exercise-modal";
import Exercises from "../../utils/meditation-exercises";

const MeditationGrid = ({ sleepQuality }: {sleepQuality: number}) => {
    const [exerciseId, setExerciseId] = useState('');
    let monitoredExercises: typeof Exercises;

    if(sleepQuality > 70) {
      monitoredExercises = Exercises.slice(-2);
    }else if(sleepQuality > 50) {
      monitoredExercises = Exercises.slice(Exercises.length / 2);
    }else {
      monitoredExercises = Exercises;
    }

    return (
        <>
            { exerciseId && <ExcerciseModal exerciseId={exerciseId} setExerciseId={setExerciseId}/> }

            <h1 className="font-bold text-lg text-gray-500 mb-6">Meditation and stress management tools</h1>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                { monitoredExercises.map((exercise, idx) => (
                    <div className="rounded-lg shadow-mainShadow p-5 hover:bg-gray-100 cursor-pointer"
                        key={idx}
                        onClick={() => setExerciseId(exercise.id)}>
                        <h2 className="font-bold text-lg">{ exercise.title }</h2>
                        <p className="line-clamp-3 text-gray-600">{ exercise.excerpt }</p>
                        <span className="block text-sm font-medium text-gray-500 mt-2 text-right">{ exercise.category }</span>
                    </div>
                )) }
            </div>
        </>
    )
}

export default MeditationGrid