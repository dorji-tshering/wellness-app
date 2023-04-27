import { DocumentData, collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { SetStateAction, useEffect, useState } from 'react';
import { MdOutlineArrowBack } from 'react-icons/md';
import { database } from "../firebaseClient";
import { useAuthValue } from "../utils/authContext";
import MealPlanDetails from "./MealPlanDetails";
import Loader from "./Loader";
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { useNotification } from "../utils/notificationContext";

type Props = {
    setShowMealPlans: React.Dispatch<SetStateAction<boolean>>
}

const MealPlans = ({ setShowMealPlans }: Props) => {
    const [mealPlans, setMealPlans] = useState<Array<DocumentData>>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [mealPlanWithID, deleteMealPlanWithID] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [mealPlanDetails, viewMealPlanDetails] = useState<DocumentData | null>(null);
    const user = useAuthValue();
    const setNotification = useNotification()?.setNotification;

    useEffect(() => {
        const q = query(collection(database, 'mealplans'), where('userId', '==', user?.uid))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setMealPlans(querySnapshot.docs);
            setLoadingData(false);
        });

        return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const deleteMealPlan = async() => {
        setDeleting(true);
        await deleteDoc(doc(database, 'mealplans', mealPlanWithID));
        setNotification && setNotification('Meal plan deleted successfully.');
        setDeleting(false);
        deleteMealPlanWithID('');
    }

    if(loadingData) {
        return (
            <div className="w-full relative h-[200px]">
                <Loader/>
            </div>
        )
    }

    return (
        <>
            { mealPlanWithID && (
                <div className="fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center p-4
                bg-black/30 z-30"
                    onClick={() => deleteMealPlanWithID('')}>
                    <div className="bg-white rounded-md shadow-md py-5 px-8 flex flex-col justify-center items-center"
                        onClick={(e) => e.stopPropagation()}>
                        <p className="font-medium">Confirm Delete?</p>
                        <p className="mb-5 text-sm text-gray-500">You can't undo the action</p>
                        <div className="flex justify-center">
                            <button className="w-[70px] text-white mr-2 bg-red-600 rounded-[4px] py-2 text-sm font-medium" 
                                onClick={deleteMealPlan}>{ deleting ? '. . .' : 'Delete' }</button>
                            <button className="w-[70px] text-white ml-2 bg-gray-500 rounded-[4px] py-2 text-sm font-medium"
                                onClick={() => deleteMealPlanWithID('')}>Cancel</button>
                        </div>
                    </div>
                </div>
            ) }
            
            { mealPlanDetails ? 
                (
                    <MealPlanDetails mealPlanDetails={mealPlanDetails} viewMealPlanDetails={viewMealPlanDetails}/>
                ) 
                : (
                    <div>
                        <header className="relative flex items-center justify-center my-4">
                            <button onClick={() => setShowMealPlans(false)}
                                className="w-8 h-8 shadow-sm rounded-full flex items-center justify-center bg-gray-200 hover:shadow-md
                                group transition-all duration-300 absolute left-0">
                                <MdOutlineArrowBack size={18} className="text-gray-500 group-hover:text-black"/>
                            </button>
                            { mealPlans.length > 0 && <h2 className="font-medium md:text-lg">My Meal Plans</h2> }
                        </header>
                        {
                            mealPlans.length > 0 ? (
                                <div className="flex justify-center flex-wrap mt-8">
                                    { mealPlans.map((mealPlan, idx) => (
                                        <div className="border mx-5 rounded-md min-w-full xs:min-w-[250px] mb-10 overflow-hidden"
                                            key={idx}>
                                            <div onClick={() => viewMealPlanDetails(mealPlan)}
                                                className="py-4 cursor-pointer">
                                                <p className="text-center font-medium">{mealPlan.data().name}</p>
                                            </div>
                                            <div className="flex justify-stretch border-t border-t-mainBorder">
                                                <button className="grow relative group flex justify-center py-2 text-gray-500 border-r
                                                    hover:bg-theme/10 hover:text-theme"
                                                    onClick={() => viewMealPlanDetails(mealPlan)}>
                                                    <RiEyeLine size={18}/>
                                                    <span className="absolute hidden  group-hover:block w-fit mx-auto left-0 right-0 -top-2 -translate-y-full px-2 py-1
                                                    bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] 
                                                    after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 
                                                    after:border-x-transparent after:border-b-transparent after:border-t-gray-700">View</span>
                                                </button>
                                                <button className="grow relative group flex justify-center py-2 text-gray-500
                                                    hover:bg-red-100 hover:text-red-600"
                                                    onClick={() => deleteMealPlanWithID(mealPlan.id)}>
                                                    <RiDeleteBin6Line/>
                                                    <span className="absolute hidden  group-hover:block w-fit mx-auto left-0 right-0 -top-2 -translate-y-full px-2 py-1
                                                    bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] 
                                                    after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 
                                                    after:border-x-transparent after:border-b-transparent after:border-t-gray-700">Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    )) }
                                </div>
                            ) : (
                                <div className="border px-4 py-5 xs:py-6 xs:px-10 mt-10 rounded-xl xs:max-w-[360px] mx-auto shadow-sm text-gray-600">
                                    <p className="text-center">You don't have any meal plans for now. Start creating one with your favorite healthy recipes.</p>
                                </div>
                            )
                        }
                </div>
            ) }
        </>
    )
}

export default MealPlans;