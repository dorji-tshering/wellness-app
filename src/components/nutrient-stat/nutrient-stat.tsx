import { useMemo } from 'react';
import Recipes from '../../utils/recipes';
import classNames from 'classnames';
import Loader from '../loader/loader';
import { useAuthValue } from '../../hooks/use-auth-context';
import { Nutrients } from '../../model/nutrient-stat';
import { useAppSelector } from '../../state/hooks';
import { selectActiveMealplan, selectFetchStatus } from '../../state/mealplans/mealplans.slice';
import { useFetch } from '../../hooks/use-fetch';

const NutrientStats = () => {
    const user = useAuthValue();
    const mealDays = ['dayOne', 'dayTwo', 'dayThree', 'dayFour', 'dayFive', 'daySix', 'daySeven'] as const;
    const activeMealplan = useAppSelector(selectActiveMealplan);
    const fetchStatus = useAppSelector(selectFetchStatus);

    useFetch('nutrientStats', user, fetchStatus);

    const nutrientStats = useMemo(() => {
        const stats: Nutrients = {};
        const recipeIds: string[] = [];
        if(activeMealplan) {
            // push recipeIds of the active meal plan to an array
            mealDays.forEach((mealday) => {
                if(activeMealplan[mealday].breakfast) {
                    recipeIds.push(activeMealplan[mealday].breakfast);
                }
                if(activeMealplan[mealday].lunch) {
                    recipeIds.push(activeMealplan[mealday].lunch);
                }
                if(activeMealplan[mealday].dinner) {
                    recipeIds.push(activeMealplan[mealday].dinner);
                }
            });

            if(recipeIds.length === 0) {
                return undefined;
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
            });
            return stats;
        } 
        return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeMealplan]);

    if(fetchStatus === 'idle' || fetchStatus === 'pending') {
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
                    <p className='mb-3 text-xs text-gray-600 font-medium'>Active plan: <span className='text-theme font-bold'>{activeMealplan?.name}</span></p>
                    <div className='flex flex-wrap'>
                        { Object.keys(nutrientStats).sort().map((nutrient, idx) => (
                            <div className='border border-black flex px-3 py-1 mb-5 mr-3 sm:mr-6 rounded-md'
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
                        Active plan: <span className='text-theme font-bold'>{activeMealplan.name}</span>
                    </p> }
                </div>
            ) }
        </div>
    )
}

export default NutrientStats