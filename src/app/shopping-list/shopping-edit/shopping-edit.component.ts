import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styles: []
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  ingredient: Ingredient = null;
  selectedIndex: number;
  editMode = false;
  slSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.slSubscription = this.shoppingListService.startedEditing.subscribe(
      (i: number) => {
        this.selectedIndex = i;
        this.editMode = true;
        this.ingredient = this.shoppingListService.getIngredient(i);
        this.slForm.setValue({
          'name': this.ingredient.name,
          'amount': this.ingredient.amount,
        });
      }
    );
  }

  ngOnDestroy() {
    this.slSubscription.unsubscribe();
  }

  onSubmit() {
    const ingredient = new Ingredient(this.slForm.value.name, this.slForm.value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.selectedIndex, ingredient);
    }
    else{
      this.shoppingListService.AddIngredient(ingredient);
    }
    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.selectedIndex);
    this.onClear();
  }

}
