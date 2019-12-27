import { Recipe } from './recipe.model';
import { EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('Recipe1', 'Test Recipe desc 1', 'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
      [
        new Ingredient('Meat', 3),
        new Ingredient('spinach', 10),
        new Ingredient('Butter', 5),
      ]),
    new Recipe('Recipe2', 'Test Recipe desc 2', 'https://upload.wikimedia.org/wikipedia/commons/3/39/Recipe.jpg',
      [
        new Ingredient('shrimp', 7),
        new Ingredient('pumpkin', 15),
        new Ingredient('Butter', 2),
      ]),
    new Recipe('Recipe3', 'Test Recipe desc 3', 'https://live.staticflickr.com/5496/31479301445_cb53c0f4e9_b.jpg',
      [
        new Ingredient('Rice', 20),
        new Ingredient('Garlic', 10),
      ]),
  ];

  getRecipe() {
    return this.recipes.slice();
  }

}
