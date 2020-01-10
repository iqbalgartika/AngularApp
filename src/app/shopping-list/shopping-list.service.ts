import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ShoppingListService {
  ingredientChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomato', 10),
    new Ingredient('Spinach', 15),
  ];

  constructor() { }

  ngOnInit() {
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(i: number) {
    return this.ingredients[i];
  }

  AddIngredient(newIngredient: Ingredient) {
    this.ingredients.push(newIngredient);
    this.ingredientChanged.next(this.getIngredients());
  }

  AddIngredients(newIngredients: Ingredient[]) {
    this.ingredients.push(...newIngredients);
    this.ingredientChanged.next(this.getIngredients());
  }

  
}
