import { updateProfile } from "firebase/auth";
import { useAuthValue } from "../../utils/auth-context";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import SleepStats from "../../components/sleep-stat/sleep-stat";
import NutrientStats from "../../components/nutrient-stat/nutrient-stat";
import { GiAtomCore, GiPathDistance, GiTimeBomb } from "react-icons/gi";
import Loader from "../../components/loader/loader";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { fetchWorkoutStats, selectStatus, selectWorkoutStats } from "../../state/workout-stats/workout-stat.slice";

const Home = () => {
    const [settingName, setSettingName] = useState(false);
    const [displayName, setDisplayName] = useState<string>('');
    const [modalOn, setModalOn] = useState(false);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    const spaceRef = useRef(0);
    const user = useAuthValue();
    const dispatch = useAppDispatch();
    const workoutStats = useAppSelector(selectWorkoutStats);
    const status = useAppSelector(selectStatus);

    useEffect(() => {
        if(user && !user.displayName) {
            setModalOn(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(user && status === 'idle') {
            dispatch(fetchWorkoutStats(user.uid));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                <div className="bg-black/30 fixed top-0 right-0 left-0 bottom-0 flex justify-center items-center">
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

            <div className="my-10">
                <h1 className="font-bold text-gray-600 text-lg mb-5">My Fitness Goals</h1>
                { status === 'idle' || status === 'pending' ? (
                    <div className="w-full relative h-[200px]">
                        <Loader/>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row mx-auto justify-between">
                            <div className="flex flex-col justify-center items-center py-6 rounded-md bg-[#67079F]/5
                                mb-10 sm:basis-[30%] md:basis-full lg:basis-[30%]">
                                <p className="mb-3"><GiTimeBomb size={30} color="#67079F"/></p>
                                <p className="">Time Spent</p>
                                <span className="mb-5 text-gray-500">(hr)</span>
                                <p className="text-5xl font-bold text-[#67079F]">{workoutStats.timeSpent}</p>
                            </div>
                            <div className="flex flex-col justify-between items-center py-6 rounded-md bg-[#F2A90D]/5
                                mb-10 sm:basis-[30%] md:basis-full lg:basis-[30%]">
                                <p className="mb-3"><GiAtomCore size={30} color="#F2A90D"/></p>
                                <p className="">Calories Burned</p>
                                <span className="mb-5 text-gray-500">(cal)</span>
                                <p className="text-5xl font-bold text-[#F2A90D]">{workoutStats.caloriesBurned}</p>
                            </div>
                            <div className="flex flex-col justify-between items-center py-6 rounded-md bg-[#1CC115]/5
                                mb-10 sm:basis-[30%] md:basis-full lg:basis-[30%]">
                                <p className="mb-3"><GiPathDistance size={30} color="#1CC115"/></p>
                                <p className="">Distance Covered</p>
                                <span className="mb-5 text-gray-500">(km)</span>
                                <p className="text-5xl font-bold text-[#1CC115]">{workoutStats.distanceCovered}</p>
                            </div>
                        </div>
                    </>
                )}
                <div className="mb-10">
                    <h1 className="font-bold text-gray-600 text-lg mb-5">Nutrient Intakes</h1>
                    <NutrientStats/>
                </div>
                <div>
                    <h1 className="font-bold text-gray-600 text-lg mb-5">My Sleep Records</h1>
                    <SleepStats/>
                </div>
            </div>
        </>
    )
}

export default Home;