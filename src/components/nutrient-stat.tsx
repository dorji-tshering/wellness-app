import { collection, query, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { database } from '../firebaseClient';
import Recipes from '../utils/recipes';
import classNames from 'classnames';
import Loader from './loader';
import { useAuthValue } from '../utils/auth-context';
import { Nutrients } from '../model/nutrient-stat';
import { listenToDocs } from '../services/facade.service';

const NutrientStats = () => {
    const [nutrientStats, setNutrientStats] = useState<Nutrients | null>(null);
    const [activeMealplan, setActiveMealplan] = useState('');
    const [loadingData, setLoadingData] = useState(true);
    const user = useAuthValue();
    const mealDays = ['dayOne', 'dayTwo', 'dayThree', 'dayFour', 'dayFive', 'daySix', 'daySeven'] as const;

    useEffect(() => {
        if(user) {
            const q = query(collection(database, 'mealplans'), where('active', '==', true), where('userId', '==', user.uid));
            const unsubscribe = listenToDocs(q, (querySnapshot) => {
                if(querySnapshot.docs[0]?.exists()) {
                    const stats: Nutrients = {};
                    const mealPlan = querySnapshot.docs[0];
                    const recipeIds: string[] = [];

                    setActiveMealplan(querySnapshot.docs[0].data().name);

                    // push recipeIds of the active meal plan to an array
                    mealDays.forEach((mealday) => {
                        if(mealPlan.data()[mealday].breakfast) {
                            recipeIds.push(mealPlan.data()[mealday].breakfast);
                        }
                        if(mealPlan.data()[mealday].lunch) {
                            recipeIds.push(mealPlan.data()[mealday].lunch);
                        }
                        if(mealPlan.data()[mealday].dinner) {
                            recipeIds.push(mealPlan.data()[mealday].dinner);
                        }
                    });

                    if(recipeIds.length === 0) {
                        setLoadingData(false);
                        return;
                    }
                    // get total nutrient intakes
                    recipeIds.forEach((recipeId) => {
                        const nutrients: Nutrients | undefined = Recipes.find((recipe) => recipe.id === recipeId)?.nutrients;
                        for(const nutrient in nutrients) {
                            const prevValue = stats[nutrient];
                            const currentValue = nutrients[nutrient];
                            if(prevValue && currentValue) {
                                stats[nutrient] = prevValue + currentValue;
                            }else {
                                stats[nutrient] = currentValue;
                            }
                        }

                        setNutrientStats(stats);
                        setLoadingData(false);
                    });
                }else {
                    setNutrientStats(null);
                    setLoadingData(false);
                }
            });

            return () => unsubscribe();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if(loadingData) {
        return (
            <div className="w-full relative h-[200px]">
                <Loader/>
            </div>
        )
    }

    return (
        <div className={classNames('bg-green-500/10 px-5 rounded-xl', 
            nutrientStats ? 'pt-5' : 'py-5')}>
            { nutrientStats ? (
                <>
                    <h1 className='mb-1 leading-5'>Your weekly nutrient intake based on your active meal plan.</h1>
                    <p className='mb-3 text-xs text-gray-600 font-medium'>Active plan: <span className='text-theme font-bold'>{activeMealplan}</span></p>
                    <div className='flex flex-wrap'>
                        { Object.keys(nutrientStats).sort().map((nutrient, idx) => (
                            <div className='border border-black flex px-3 py-1 mb-4 mr-3 sm:mr-6 rounded-md'
                                key={idx}>
                                <p className='mr-2 text-sm'>{ nutrient.charAt(0).toUpperCase() + nutrient.slice(1) + ':' }</p> 
                                <span className='font-bold text-gray-700'>{ nutrientStats[nutrient] }</span>
                            </div>
                        )) }
                    </div>
                </>
            ) : (
                <div>
                    <p>No nutrient stats to show for now. Stats will show here based on your active meal plan after you have added a recipe to the plan.</p>
                    { activeMealplan && <p className='mt-3 text-xs text-gray-600 font-medium'>
                        Active plan: <span className='text-theme font-bold'>{activeMealplan}</span>
                    </p> }
                </div>
            ) }
        </div>
    )
}

export default NutrientStats