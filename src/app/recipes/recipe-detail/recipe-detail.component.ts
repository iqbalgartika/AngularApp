import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RecipeService } from '../recipe.service';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router, private store: Store<AppState>) { }

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
    this.recipeService.addToShoppingList(this.recipe.ingredients);
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['../']);
  }
}
