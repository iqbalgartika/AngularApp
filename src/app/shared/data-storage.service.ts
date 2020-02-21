import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AppState } from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions'

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private store: Store<AppState>) { }

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
        this.store.dispatch(new RecipeActions.SetRecipes(recipes));
      })
    );
  }

}
