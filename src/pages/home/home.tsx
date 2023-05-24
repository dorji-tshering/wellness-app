import { updateProfile } from "firebase/auth";
import { useAuthValue } from "../../hooks/use-auth-context";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import SleepStats from "../../components/sleep-stat/sleep-stat";
import NutrientStats from "../../components/nutrient-stat/nutrient-stat";
import { GiAtomCore, GiPathDistance, GiTimeBomb } from "react-icons/gi";
import Loader from "../../components/loader/loader";
import { useAppSelector } from "../../state/hooks";
import { selectRecords, selectStatus } from "../../state/workout-stats/workout-stat.slice";
import { useFetch } from "../../hooks/use-fetch";
import { useWorkoutStat } from "../../hooks/use-workout-stats";
import { getWorkoutName } from "../../utils/workout-options";

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

            <div className="mt-5">
                <h1 className="font-bold text-gray-600 text-lg mb-5">Fitness Stats</h1>
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
                                <div className="text-[#67079F] w-full">
                                  { Object.entries(workoutStats.timeSpent).map((timeStats, idx) => (
                                    <p key={idx}
                                      className="flex">
                                      <span className="basis-1/2 text-right mr-2">{ getWorkoutName(timeStats[0]) }</span>: 
                                      <span className="basis-1/2 text-left ml-2">{timeStats[1]}</span>
                                    </p>
                                  )) }
                                </div>
                            </div>
                            <div className="flex flex-col justify-between items-center py-6 rounded-md bg-[#F2A90D]/5
                                mb-10 sm:basis-[30%] md:basis-full lg:basis-[30%]">
                                <p className="mb-3"><GiAtomCore size={30} color="#F2A90D"/></p>
                                <p className="">Calories Burned</p>
                                <span className="mb-5 text-gray-500">(cal)</span>
                                <div className="text-[#F2A90D] w-full">
                                  { Object.entries(workoutStats.caloriesBurned).map((calorieStat, idx) => (
                                    <p key={idx}
                                      className="flex">
                                      <span className="basis-1/2 text-right mr-2">{ getWorkoutName(calorieStat[0]) }</span>: 
                                      <span className="basis-1/2 text-left ml-2">{calorieStat[1]}</span>
                                    </p>                                 
                                  )) }
                                </div>
                            </div>
                            <div className="flex flex-col justify-between items-center py-6 rounded-md bg-[#1CC115]/5
                                mb-10 sm:basis-[30%] md:basis-full lg:basis-[30%]">
                                <p className="mb-3"><GiPathDistance size={30} color="#1CC115"/></p>
                                <p className="">Distance Covered</p>
                                <span className="mb-5 text-gray-500">(km)</span>
                                <div className="text-[#1CC115] w-full">
                                  { Object.entries(workoutStats.distanceCovered).map((distanceStats, idx) => (
                                    <p key={idx}
                                      className="flex">
                                      <span className="basis-1/2 text-right mr-2">{ getWorkoutName(distanceStats[0]) }</span>: 
                                      <span className="basis-1/2 text-left ml-2">{ isNaN(distanceStats[1]) ? 
                                        'NaN' : distanceStats[1] }
                                      </span>
                                    </p>                                 
                                  )) }
                                </div>
                            </div>
                        </div>
                    </>
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