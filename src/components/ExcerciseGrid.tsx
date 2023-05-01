import { useState } from "react";
import ExcerciseModal from "./ExcerciseModal";
import Exercises from "../utils/meditationExercises";


const MeditationGrid = () => {
    const [exerciseId, setExerciseId] = useState('');

    return (
        <>
            { exerciseId && <ExcerciseModal exerciseId={exerciseId} setExerciseId={setExerciseId}/> }
            <h1 className="font-bold text-lg text-gray-500 mb-6">Meditation and stress management tools</h1>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                { Exercises.map((exercise) => (
                    <div className="rounded-lg shadow-mainShadow p-5 hover:bg-gray-100 cursor-pointer"
                        onClick={() => setExerciseId(exercise.id)}>
                        <h2 className="font-bold text-lg">{ exercise.title }</h2>
                        <p className="line-clamp-3">{ exercise.excerpt }</p>
                        <span className="block text-sm font-medium text-gray-500 mt-2 text-right">{ exercise.category }</span>
                    </div>
                )) }
            </div>
        </>
    )
}

export default MeditationGrid