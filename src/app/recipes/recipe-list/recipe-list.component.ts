import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { AppState } from 'src/app/store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('recipe')
    .pipe(map(recipesState => recipesState.recipes))
    .subscribe(
      (recipeList: Recipe[]) => {
        this.recipes = recipeList;
      }
    );
  }

}
