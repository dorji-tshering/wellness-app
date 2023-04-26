import { SetStateAction } from 'react';
import Recipes from '../utils/recipes';

type Props = {
    recipeId: string, 
    setViewRecipeWithID: React.Dispatch<SetStateAction<string>>
}

type Recipe = {
    name: string;
    id: string;
    image: string;
    ingredients: string[];
    directions: string[];
    nutrients: {
        [index: string]: number
    };
}

const RecipeModal = ({ recipeId, setViewRecipeWithID }: Props) => {
    const recipe: Recipe | undefined = Recipes.find((recipe) => recipe.id === recipeId);

    return (
        <div className='fixed top-0 right-0 left-0 bottom-0 bg-black/30 z-30 flex justify-center items-center px-4 py-5'
            onClick={() => setViewRecipeWithID('')}>
            <div className='h-full overflow-auto'>
                <div className='bg-white rounded-md shadow-md px-6 py-10 xs:max-w-[380px] sm:max-w-[450px] md:max-w-[700px]
                    min-h-full'
                    onClick={(e) => e.stopPropagation()}>
                    <header className='flex justify-between mb-5'>
                        <h1 className='font-bold text-lg sm:text-xl'>{ recipe?.name }</h1>
                        <button className='text-[10px] font-bold py-1 px-3 border border-mainBorder rounded-md shadow-sm bg-gray-50
                        text-gray-500 hover:text-inherit hover:shadow-md' 
                            onClick={() => setViewRecipeWithID('')}>CLOSE</button>
                    </header>
                    <section>
                        <div className='h-[150px] sm:h-[200px] md:h-[250px] overflow-hidden'>
                            <img className='object-cover h-full w-full' 
                                src={recipe?.image} 
                                alt={recipe?.image} />
                        </div>
                        <div className='flex justify-between my-3 flex-wrap border-b'>
                            {
                                recipe && Object.keys(recipe.nutrients).map((nutrient, idx) => (
                                    <div className='flex text-xs md:text-sm mb-3 mx-2' key={idx}>
                                        <p className='text-gray-500 mr-1'>{ nutrient.charAt(0).toUpperCase() + nutrient.slice(1) + ':' }</p>
                                        <p>{ recipe.nutrients[nutrient] }</p>
                                    </div>
                                ))
                            }
                        </div>
                        <div className='mb-8'>
                            <h2 className='font-bold text-[16px] md:text-lg'>Ingredients</h2>
                            <ul>
                                {
                                    recipe?.ingredients.map((ingredient, idx) => (
                                        <li className='before:content-[""] before:w-1 before:h-1 before:bg-gray-600 before:inline-block flex
                                        before:rounded-full before:relative before:top-2 before:mr-2'
                                        key={idx}>{ ingredient }</li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div>
                            <h2 className='font-bold text-[16px] md:text-lg'>Directions</h2>
                            <ol>
                                {
                                    recipe?.directions.map((direction, idx) => (
                                        <li className='flex'
                                            key={idx}
                                            ><span className='mr-2 font-medium'>{idx+1+'.'}</span>{ direction }</li>
                                    ))
                                }
                            </ol>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default RecipeModal;