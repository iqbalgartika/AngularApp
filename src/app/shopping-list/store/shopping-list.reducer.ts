import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListAction from './shopping-list.action';

const initialState = {
    ingredients: [
        new Ingredient('Apple', 5),
        new Ingredient('Tomato', 10),
        new Ingredient('Spinach', 15)
    ]
};

export function shoppingListReducer(state = initialState, action: ShoppingListAction.AddIngredient) {
    switch (action.type) {
        case ShoppingListAction.ADD_INGREDIENT :
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        default:
            return state;
    }
}