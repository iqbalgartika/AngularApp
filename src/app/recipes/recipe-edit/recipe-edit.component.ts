import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { AppState } from 'src/app/store/app.reducer';
import * as RecipeActions from '../store/recipe.actions'

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
  animations: [
    trigger('divIngredient', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({
          opacity: 0,
          transform: 'translateX(100px)'
        }))
      ])
    ])
  ]
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  recipeForm: FormGroup;
  recipeSubscription: Subscription;
  storeSub: Subscription;
  id: number;
  editMode = false;

  get ingredientsControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<AppState>) { }

  ngOnInit() {
    this.recipeSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params["id"]-1;
        this.editMode = params["id"] != null; 
        this.initForm();
      }
    );
  }

  initForm() {
    let recipeName = '';
    let recipeImageUrl = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store.select('recipe').pipe(map(
        recipeState => {
          return recipeState.recipes.find((recipe, index) => {
            return index === this.id;
          })
      })).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImageUrl = recipe.imageUrl;
        recipeDescription = recipe.description;
        if (recipe['ingredients']) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)]),
            }));
          }
        }
      });
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imageUrl': new FormControl(recipeImageUrl, [Validators.required]),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients,
    });
  }

  ngOnDestroy() {
    this.recipeSubscription.unsubscribe();
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  onSubmit() {
    // const recipe = new Recipe(this.recipeForm.value['name'], this.recipeForm.value['description'], this.recipeForm.value['imageUrl'], this.recipeForm.value['ingredients']);
    if (this.editMode) {
      this.store.dispatch(new RecipeActions.UpdateRecipe({ index: this.id, recipe: this.recipeForm.value}));
      
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    }
    else {
      this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));
      // this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)]),
    }));
  }

  onDeleteIngredient(i: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(i);
  }
}
