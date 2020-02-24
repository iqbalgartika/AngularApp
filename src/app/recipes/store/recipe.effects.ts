import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';

import * as RecipeActions from './recipe.actions'
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { dispatch } from 'rxjs/internal/observable/pairs';

@Injectable()
export class RecipeEffects {
    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipeActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>('https://ng-recipe-book-6690d.firebaseio.com/recipes.json');
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                }
            });
        }),
        map(recipes => {
            return new RecipeActions.SetRecipes(recipes);
        })
    )
    
    @Effect({ dispatch: false })
    storeRecipes = this.actions$.pipe(
        ofType(RecipeActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipe')),
        switchMap(([actionData, recipeState]) => {
            return this.http.put('https://ng-recipe-book-6690d.firebaseio.com/recipes.json', recipeState.recipes);
        })
    );

    constructor(private actions$: Actions, private http: HttpClient, private store: Store<AppState>) {}

}