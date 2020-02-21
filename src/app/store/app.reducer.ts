import { ActionReducerMap } from '@ngrx/store'

import * as fromAuth from '../auth/store/auth.reducer'
import * as fromRecipe from '../recipes/store/recipe.reducer'
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer'

export interface AppState {
    auth: fromAuth.State;
    recipe: fromRecipe.State;
    shoppingList: fromShoppingList.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    recipe: fromRecipe.recipeReducer,
    shoppingList: fromShoppingList.shoppingListReducer,
}
