import { Props } from '../model/exercise-modal';
import Exercises from '../utils/meditation-exercises';

const MeditationModal = ({ exerciseId, setExerciseId }: Props) => {
    const exercise = Exercises.find((exercise) => exercise.id === exerciseId);


    return (
        <div className='fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-30 flex justify-center items-center px-4 py-5'
            onClick={() => setExerciseId('')}>
            <div className='max-h-full overflow-auto rounded-md'>
                <div className='bg-white rounded-md shadow-md px-6 pb-10 pt-5 xs:max-w-[380px] sm:max-w-[450px] md:max-w-[700px]'
                    onClick={(e) => e.stopPropagation()}>
                    <header className='flex justify-between py-3 md:py-5 bg-white/90 sticky -top-[2px]'>
                        <h1 className='font-bold text-[17px] xs:text-lg sm:text-xl mr-3'>{ exercise?.title }</h1>
                        <button className='text-[10px] font-bold py-1 px-3 border border-mainBorder rounded-md shadow-sm bg-gray-50
                        text-gray-500 hover:text-inherit hover:shadow-md h-fit' 
                            onClick={() => setExerciseId('')}>CLOSE</button>
                    </header>
                    <section className='text-gray-600'>
                        { exercise?.steps ? (
                            <>
                                <p className='mb-4'>{ exercise.excerpt }</p>
                                <ul className='list-disc list-inside'>
                                    { exercise.instructions?.map((step, idx) => (
                                        <li key={idx} className='mb-2 last:mb-0'>
                                            { step }
                                        </li>
                                    )) }
                                </ul>
                            </>
                        ) : (
                            exercise?.paragraphs?.map((paragraph, idx) => (
                                <p className='mb-4 last:mb-0' key={idx}>{ paragraph }</p>
                            ))
                        ) }
                    </section>
                </div>
            </div>
        </div>
    )
}

export default MeditationModal;