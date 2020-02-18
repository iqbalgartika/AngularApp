import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListAction from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styles: []
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  ingredient: Ingredient = null;
  editMode = false;
  slSubscription: Subscription;

  constructor(
    private store: Store<fromShoppingList.AppState>
  ) { }

  ngOnInit() {
    this.slSubscription = this.store.select('shoppingList').subscribe(
      stateData => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.ingredient = stateData.editedIngredient;
          this.slForm.setValue({
            'name': this.ingredient.name,
            'amount': this.ingredient.amount,
          });
        }
        else{
          this.editMode = false;
        }
        
      }
    );
  }

  ngOnDestroy() {
    this.slSubscription.unsubscribe();
    this.store.dispatch(new ShoppingListAction.StopEditing())
  }

  onSubmit() {
    const newIngredient = new Ingredient(this.slForm.value.name, this.slForm.value.amount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListAction.UpdateIngredient(newIngredient));
    }
    else{
      this.store.dispatch(new ShoppingListAction.AddIngredient(newIngredient));
    }
    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListAction.StopEditing())
  }

  onDelete() {
    // this.shoppingListService.deleteIngredient(this.selectedIndex);
    this.store.dispatch(new ShoppingListAction.DeleteIngredient())
    this.onClear();
  }

}
