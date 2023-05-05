import { SetStateAction } from "react";

export type Props = {
    recipeId: string, 
    setViewRecipeWithID: React.Dispatch<SetStateAction<string>>
}

export type Recipe = {
    name: string;
    id: string;
    image: string;
    ingredients: string[];
    directions: string[];
    nutrients: {
        [index: string]: number | undefined
    };
}