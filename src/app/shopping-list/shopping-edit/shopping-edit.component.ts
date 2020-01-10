import { Component, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styles: []
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('f', {static: false}) slForm: NgForm;
  ingredient: Ingredient = null;
  selectedIndex: number;
  editMode = false;
  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.shoppingListService.startedEditing.subscribe(
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

  onSubmit() {
    this.shoppingListService.AddIngredient(new Ingredient(this.slForm.value.name, this.slForm.value.amount));
  }

  
}
