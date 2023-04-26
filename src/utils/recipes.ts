const Recipes = [
    {
        name: 'Lettuce Salad',
        id: '1',
        image: '/images/cabbage.jpg',
        ingredients: [
            '6 large hearts of romaine, chopped',
            '2 anchovies',
            'Tbsp. fresh lemon juice',
            '½ tsp. black pepper',
            '2 garlic cloves, finely minced',
        ],
        directions: [
            `Croutons: Preheat the oven to 375 degrees Fahrenheit. In a medium-sized bowl, 
            combine the olive oil and minced garlic. Add the cubed baguette and toss to coat. 
            Spread the croutons on a baking sheet and bake for 5–8 minutes, or until crisp and golden brown.`,
            `Dressing: In the container of a food processor combine the beans, water, anchovy, 
            lemon juice, garlic, Parmesan cheese, and black pepper. Process until smooth. With the motor running, 
            slowly add the olive oil to create a creamy, emulsified dressing.`,
            `Chop heart of romaine. In a large mixing bowl combine the chopped lettuce and dressing, 
            tossing well to ensure all of the lettuce is coated with the dressing.`,
        ],
        nutrients: {
            calories: 23,
            protein: 10,
            carbohydrate: 20,
            fat: 40,
        }
    },
    {
        name: 'Beans with Almonds',
        id: '2',
        image: '/images/beans.jpg',
        ingredients: [
            '1 tbsp white wine vinegar',
            '1 tbsp	olive oil',
            'Salt and pepper to taste',
            '1 lb green beans',
            '1/4 cup sliced almonds',
        ],
        directions: [
            `In a small bowl, whisk olive oil, vinegar, Dijon mustard, salt and pepper.`,
            `In a steamer basket steam green beans until tender, 3 to 5 minutes. immediately 
            rinse beans under cold water to stop the cooking. Toss cold beans in dressing and top with slivered almonds.`,
            `Serve immediately or store in the refrigerator for up to 4 days.`,
        ],
        nutrients: {
            calories: 96,
            protein: 130,
            carbohydrate: 30,
            fat: 44,
        }
    },
    {
        name: 'Whole Wheat Bread',
        id: '3',
        image: '/images/bread.jpg',
        ingredients: [
            '2 tbsp	crumbled goat cheese',
            '1/4 English cucumber, thinly sliced',
            '4 slices whole wheat bread',
            '1/2 cup arugula',
            '1 tbsp chopped fresh parsley',
        ],
        directions: [
            `In a small bowl, mash the avocado. Mix in the parsley, basil, chives, and lemon juice. 
            Season the mashed avocado with salt and pepper to taste.`,
            `Spread the mixture over 2 slices of the bread. Add a layer of the sliced cucumbers, 
            goat cheese, arugula, and sprouts. Top with the remaining slices of bread.`,
            `Serve immediately.`,
        ],
        nutrients: {
            calories: 200,
            protein: 50,
            carbohydrate: 23,
            fat: 39,
        }
    },
    {
        name: 'Garlic Butter Chicken',
        id: '4',
        image: '/images/chicken.jpg',
        ingredients: [
            '2 tsp paprika',
            '1 tsp garlic powder',
            '1 tsp onion powder',
            '1/2 tsp dried oregano',
            '1/2 tsp dried thyme',
            '1/2 tsp salt',
            '1 tbsp oil',
            '8 boneless skinless chicken thighs',
            '1 tbsp butter',
            '2 garlic cloves, minced',
            '1/3 cup chicken broth',
        ],
        directions: [
            `In a small bowl, whisk together the paprika, garlic powder, onion powder, oregano, 
            thyme, and salt. Sprinkle some of the seasoning on one side of the chicken.`,
            `In a large skillet, heat the oil over medium-high heat. Arrange the chicken in the skillet, seasoned side down.`,
            `Season the remaining side of the chicken with the seasoning blend. Cook until it begins to brown, 
            about 4 to 5 minutes. Flip the chicken and continue to cook until the remaining side is golden, 
            about 3 to 4 minutes. Once golden, add the butter to the skillet. Once it is melted, add the 
            garlic and cook until it is fragrant, about 30 seconds. Add the chicken broth to deglaze the pan, 
            spooning the mixture over the chicken thighs. Continue to cook until the broth has reduced 
            and the chicken reaches an internal temperature of 165ºF, about 1 to 2 minutes.`,
            `Serve immediately or store in the refrigerator for up to 3 days.`,
        ],
        nutrients: {
            calories: 432,
            protein: 167, 
            carbohydrate: 233,
            fat: 20,
        }
    },
    {
        name: 'Tomatoe Salad',
        id: '5',
        image: '/images/tomato.jpg',
        ingredients: [
            '2 tomatoes, diced',
            '1/2 red onion, minced',
            '1/4 cup fresh parsley, finely chopped',
            '1/2 lemon, juice',
            '1 tbsp olive oil',
        ],
        directions: [
            `Toss all of the ingredients together.`,
            `Serve immediately or store in the refrigerator for up to 5 days.`,
        ],
        nutrients: {
            calories: 0,
            protein: 0,
            carbohydrate: 20,
            fat: 0,
        }
    },
    {
        name: 'Hearty Vegetable Soup',
        id: '6',
        image: '/images/vegetable.jpg',
        ingredients: [
            '3 cups	vegetable broth',
            '1/4 lb	green beans, trimmed and halved',
            '1 cup green peas, fresh or frozen',
            '2 tbsp chopped fresh parsley',
        ],
        directions: [
            `In a large pot or Dutch oven, heat the oil over medium-high heat. Add the onion, carrot, and celery. 
            Cook, stirring occasionally, until the onions have softened, about 3 minutes. Stir in the garlic, 
            oregano, and thyme and cook until they become fragrant, about 30 seconds. Stir in the diced tomatoes, 
            cannellini beans, green cabbage, and zucchini. Stir in the broth and season the soup with salt and pepper 
            to taste. Bring the soup to a boil then reduce the heat to a simmer. Cook, stirring occasionally, until 
            the liquid has reduced slightly and the flavours have intensified, about 20 minutes.`,
            `Stir in the green beans and peas and cook until they are bright green, about 3 minutes.`,
            `Serve the soup immediately topped with the parsley or store in the refrigerator for up to 3 days.`,
        ],
        nutrients: {
            calories: 100,
            protein: 5,
            carbohydrate: 9,
            fat: 2,
        }
    },
];

export default Recipes;