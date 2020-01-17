import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipes() {
    const recipe = this.recipeService.getRecipes();
    this.http.put('https://ng-recipe-book-6690d.firebaseio.com/recipes.json', recipe).subscribe(
      responseData => {
        console.log(responseData);
      }
    );
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://ng-recipe-book-6690d.firebaseio.com/recipes.json')
    .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          }
        });
      }),
      tap(recipes => {
          this.recipeService.setRecipes(recipes);
      })
    );
  }

}
