import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/store/app.reducer';
import * as RecipeActions from '../store/recipe.actions'
import * as ShoppingListAction from '../../shopping-list/store/shopping-list.actions'

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<AppState>) { }

  ngOnInit() {
    this.route.params.pipe(
      map(params => {return +params['id']}),
      switchMap(id => { //switch to store observable
        this.id = id-1;
        return this.store.select('recipe');
      }),
      map(recipeState => {
        return recipeState.recipes.find((recipe,index) => {
          return index == this.id;
        })
      })
    )
    .subscribe(recipe => {
      this.recipe = recipe;
    });
  }

  onAddtoShoppingList() {
    this.store.dispatch(new ShoppingListAction.AddIngredients(this.recipe.ingredients))
  }

  onDelete() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['../']);
  }
}
