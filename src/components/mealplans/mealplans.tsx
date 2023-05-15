import { useEffect, useRef, useState } from 'react';
import { MdOutlineArrowBack, MdRadioButtonUnchecked, MdCheckCircle } from 'react-icons/md';
import { useAuthValue } from "../../utils/auth-context";
import MealPlanDetails from "../meal-plan-details/meal-plan-details";
import Loader from "../loader/loader";
import { RiDeleteBin6Line, RiEyeLine } from 'react-icons/ri';
import { useNotification } from "../../utils/notification-context";
import classNames from "classnames";
import { Props } from "../../model/mealplans";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { deleteMealplan, fetchMealplans, selectFetchStatus, selectMealplans, toggleActivePlan } from "../../state/mealplans/mealplans.slice";

const Mealplans = ({ setShowMealPlans }: Props) => {
    const [mealplanIdToDelete, setMealplanIdToDelete] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [mealplanIdToView, setMealplanIdToView] = useState<string | null>(null);
    const activeMealplanRef = useRef<string | null>(null);
    const user = useAuthValue();
    const setNotification = useNotification()?.setNotification;
    const mealplans = useAppSelector(selectMealplans);
    const fetchStatus = useAppSelector(selectFetchStatus);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(user && fetchStatus === 'idle') {
            dispatch(fetchMealplans(user.uid));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    // store current active mealplan in a ref
    const currentActiveMealplan = (mealPlanID: string) => {
        activeMealplanRef.current = mealPlanID;
        return null;
    }

    const handleDeleteMealplan = async() => {
        setDeleting(true);
        await dispatch(deleteMealplan(mealplanIdToDelete));
        setNotification && setNotification('Meal plan deleted successfully.');
        activeMealplanRef.current = null;
        setDeleting(false);
        setMealplanIdToDelete('');
    }

    if(fetchStatus === 'idle' || fetchStatus === 'pending') {
        return (
            <div className="w-full relative h-[200px]">
                <Loader/>
            </div>
        )
    }

    return (
        <>
            { mealplanIdToDelete && (
                <div className="fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center p-4
                bg-black/30 z-30"
                    onClick={() => setMealplanIdToDelete('')}>
                    <div className="bg-white rounded-md shadow-md py-5 px-8 flex flex-col justify-center items-center"
                        onClick={(e) => e.stopPropagation()}>
                        <p className="font-medium">Confirm Delete?</p>
                        <p className="mb-5 text-sm text-gray-500">You can't undo the action</p>
                        <div className="flex justify-center">
                            <button className="w-[70px] text-white mr-2 bg-red-600 rounded-[4px] py-2 text-sm font-medium" 
                                onClick={handleDeleteMealplan}>{ deleting ? '. . .' : 'Delete' }</button>
                            <button className="w-[70px] text-white ml-2 bg-gray-500 rounded-[4px] py-2 text-sm font-medium"
                                onClick={() => setMealplanIdToDelete('')}>Cancel</button>
                        </div>
                    </div>
                </div>
            ) }
            
            { mealplanIdToView ? 
                (
                    <MealPlanDetails mealplanId={mealplanIdToView} setMealplanIdToView={setMealplanIdToView}/>
                ) 
                : (
                    <div>
                        <header className="relative flex items-center justify-center my-4">
                            <button onClick={() => setShowMealPlans(false)}
                                className="w-8 h-8 shadow-sm rounded-full flex items-center justify-center bg-gray-200 hover:shadow-md
                                group transition-all duration-300 absolute left-0">
                                <MdOutlineArrowBack size={18} className="text-gray-500 group-hover:text-black"/>
                            </button>
                            { mealplans.length > 0 && <h2 className="font-medium md:text-lg">My Meal Plans</h2> }
                        </header>
                        {
                            mealplans.length > 0 ? (
                                <div className="flex justify-center flex-wrap mt-8">
                                    { mealplans.map((mealPlan, idx) => (
                                        <div className={classNames('border mx-5 rounded-md min-w-full xs:min-w-[250px] mb-10',
                                            mealPlan.active && 'border-theme')}
                                            key={idx}>
                                            { mealPlan.active && currentActiveMealplan(mealPlan.id) }
                                            <div onClick={() => setMealplanIdToView(mealPlan.id)}
                                                className={classNames('py-4 cursor-pointer relative hover:bg-gray-100 rounded-tr-md rounded-tl-md',
                                                mealPlan.active && 'text-theme')}>
                                                <p className="text-center font-medium">{ mealPlan.name }</p>
                                                <button className={ classNames('absolute top-2 right-2 group rounded-full',
                                                    mealPlan.active ? 'text-theme cursor-default' : 
                                                    `text-gray-500 hover:ring-[3px] hover:ring-gray-300 transition-all duration-500`) }
                                                    onClick={ mealPlan.active ? (e) => {
                                                      e.stopPropagation();
                                                      dispatch(toggleActivePlan({
                                                        event: e,
                                                        isActiveMealPlan: true,
                                                        mealplanID: mealPlan.id,
                                                        activeMealplanRef: activeMealplanRef,
                                                      }));
                                                    } : 
                                                    (e) => dispatch(toggleActivePlan({
                                                        event: e,
                                                        isActiveMealPlan: false,
                                                        mealplanID: mealPlan.id,
                                                        activeMealplanRef: activeMealplanRef,
                                                    }))}>
                                                    { mealPlan.active ? <MdCheckCircle size={20}/> : <MdRadioButtonUnchecked size={20}/> }
                                                    <span className="absolute hidden whitespace-nowrap  md:group-hover:block w-[90px] left-1/2 -top-2 
                                                        -translate-y-full px-2 py-1 -ml-[45px]
                                                        bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] 
                                                        after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 
                                                        after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                                                            { mealPlan.active ? 'Active plan' : 'Set active' }
                                                    </span>
                                                </button>
                                            </div>
                                            <div className="flex justify-stretch border-t border-t-mainBorder">
                                                <button className="grow relative group flex justify-center py-2 text-gray-500 border-r
                                                    hover:bg-theme/10 hover:text-theme"
                                                    onClick={() => setMealplanIdToView(mealPlan.id)}>
                                                    <RiEyeLine size={18}/>
                                                    <span className="absolute hidden  group-hover:block w-fit mx-auto left-0 right-0 -top-2 -translate-y-full px-2 py-1
                                                        bg-gray-700 rounded-lg text-center text-white text-sm after:content-[''] 
                                                        after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 
                                                        after:border-x-transparent after:border-b-transparent after:border-t-gray-700">View</span>
                                                </button>
                                                <button className="grow relative group flex justify-center py-2 text-gray-500
                                                    hover:bg-red-100 hover:text-red-600 rounded-br-md"
                                                    onClick={() => setMealplanIdToDelete(mealPlan.id)}>
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

export default Mealplans;