import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListAction from '../shopping-list/store/shopping-list.action'
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer'

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  constructor(
    private store: Store<fromShoppingList.AppState>
  ) {}

  private recipes: Recipe[] = [];
  // private recipes: Recipe[] = [
  //   new Recipe('Recipe1', 'Test Recipe desc 1', 'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
  //     [
  //       new Ingredient('Meat', 3),
  //       new Ingredient('spinach', 10),
  //       new Ingredient('Butter', 5),
  //     ]),
  //   new Recipe('Recipe2', 'Test Recipe desc 2', 'https://upload.wikimedia.org/wikipedia/commons/3/39/Recipe.jpg',
  //     [
  //       new Ingredient('shrimp', 7),
  //       new Ingredient('pumpkin', 15),
  //       new Ingredient('Butter', 2),
  //     ]),
  //   new Recipe('Recipe3', 'Test Recipe desc 3', 'https://live.staticflickr.com/5496/31479301445_cb53c0f4e9_b.jpg',
  //     [
  //       new Ingredient('Rice', 20),
  //       new Ingredient('Garlic', 10),
  //     ]),
  // ];

  setRecipes(recipeList: Recipe[]) {
    this.recipes = recipeList;
    this.recipesChanged.next(this.getRecipes());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(i: number) {
    return this.recipes[i-1];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.getRecipes());
  }

  updateRecipe(i: number, recipe: Recipe) {
    this.recipes[i-1] = recipe;
    this.recipesChanged.next(this.getRecipes());
  }

  deleteRecipe(i: number) {
    this.recipes.splice(i-1, 1);
    this.recipesChanged.next(this.getRecipes());
  }

  addToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListAction.AddIngredients(ingredients))
  }

}
