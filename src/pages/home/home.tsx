import { updateProfile } from "firebase/auth";
import { useAuthValue } from "../../hooks/use-auth-context";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import SleepStats from "../../components/sleep-stat/sleep-stat";
import NutrientStats from "../../components/nutrient-stat/nutrient-stat";
import Loader from "../../components/loader/loader";
import { useAppSelector } from "../../state/hooks";
import { selectRecords, selectStatus } from "../../state/workout-stats/workout-stat.slice";
import { useFetch } from "../../hooks/use-fetch";
import { useWorkoutStat } from "../../hooks/use-workout-stats";
import WorkoutStats from "../../components/workout-stat-and-table/workout-stat";

const Home = () => {
    const [settingName, setSettingName] = useState(false);
    const [displayName, setDisplayName] = useState<string>('');
    const [modalOn, setModalOn] = useState(false);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const spaceRef = useRef(0);
    const user = useAuthValue();
    const records = useAppSelector(selectRecords);
    const workoutStats = useWorkoutStat(records);
    const status = useAppSelector(selectStatus);

    useEffect(() => {
        if(user && !user.displayName) {
            setModalOn(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useFetch('workoutStats', user, status);

    const updateDisplayName = async(event: FormEvent) => {
        event.preventDefault();

        if(displayName.length >= 1 && submitButtonRef.current && user) {
            submitButtonRef.current.disabled = true;
            setSettingName(true);

            try {
                await updateProfile(user, {
                    displayName: displayName
                });
                window.location.reload();
            }catch(err: any) {
                submitButtonRef.current.disabled = false;
                setSettingName(false);
            }
        }
    }

    // allow only single space between characters/words
    const checkDisplayName = (e: ChangeEvent<HTMLInputElement>) => {
        let lastChar = e.target.value.charAt(e.target.value.length - 1);

        // disallow first character to be space
        if(lastChar === ' ' && e.target.value.length === 1) {
            setDisplayName('');
            return;
        }

        if(lastChar === ' ') {
            if(displayName?.charAt(displayName.length - 1) === '.') {
                spaceRef.current = 0;
            }
            if(spaceRef.current === 1) {
                setDisplayName(e.target.value.slice(0, -1));   
            }else {
                spaceRef.current = 1;
                setDisplayName(e.target.value);
            }
        }else {
            if(spaceRef.current === 1) {
                spaceRef.current = 0;
            }
            setDisplayName(e.target.value);
        }
    }

    return (
        <>
            { modalOn && (
                <div className="bg-black/30 fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center z-50">
                    <form 
                        onSubmit={updateDisplayName}
                        className="bg-white p-5 rounded-md shadow-md flex flex-col items-center">
                        <h1 className="mb-3 font-medium">Display Name</h1>
                        <input 
                            type="text"
                            value={displayName}
                            onChange={checkDisplayName}
                            placeholder="Your name"
                            className="border border-mainBorder outline-none rounded-[4px] px-2 py-1" />
                        <span className="mb-3 text-xs mt-1 text-gray-500">Atleast a character expected</span>
                        <button 
                            type="submit"
                            ref={submitButtonRef}
                            className="bg-theme text-white rounded-[4px] min-w-[80px] py-2">
                                { settingName ? '. . .' : 'Set' }
                            </button>
                    </form>
                </div>
            ) }

            <div className="mt-5">
                <h1 className="font-bold text-gray-600 text-lg mb-5">Fitness Stats</h1>
                { status === 'idle' || status === 'pending' ? (
                    <div className="w-full relative h-[200px]">
                        <Loader/>
                    </div>
                ) : (
                    <WorkoutStats workoutStats={workoutStats}/>
                )}
                <div className="mb-10">
                    <h1 className="font-bold text-gray-600 text-lg mb-5">Nutrient Intakes</h1>
                    <NutrientStats/>
                </div>
                <div>
                    <h1 className="font-bold text-gray-600 text-lg mb-5">Sleep Stats</h1>
                    <SleepStats/>
                </div>
            </div>
        </>
    )
}

export default Home;