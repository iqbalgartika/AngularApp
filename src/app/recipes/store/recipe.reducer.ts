import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions'

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
}


export function recipeReducer(state = initialState, action: RecipesActions.RecipesActions) {
    switch(action.type) {
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
        case RecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [
                    ...state.recipes,
                    action.payload
                ]
            };
        case RecipesActions.UPDATE_RECIPE:
            const recipe = state.recipes[action.payload.index];
            const updatedRecipe = {
                ...recipe,
                ...action.payload.recipe
            }
            const updatedRecipeList = [...state.recipes];
            updatedRecipeList[action.payload.index] = updatedRecipe;
            return {
                ...state,
                recipes: updatedRecipeList
            }

        case RecipesActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((recipe,index) => {
                    return index !== action.payload;
                })
            };
        default:
            return state;
    }
}