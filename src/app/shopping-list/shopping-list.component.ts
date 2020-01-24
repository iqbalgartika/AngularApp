import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredient: Ingredient[] }>;
  // ingredientSub: Subscription;

  constructor(private shoppingListService: ShoppingListService, private store: Store<{ shoppingList: { ingredient: Ingredient[] } }>) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.ingredientSub = this.shoppingListService.ingredientChanged.subscribe(
    //   (ingredientList: Ingredient[]) => {
    //     this.ingredients = ingredientList;
    //   }
    // );
  }

  ngOnDestroy() {
    // this.ingredientSub.unsubscribe();
  }
  
  onSelect(i: number) {
    this.shoppingListService.startedEditing.next(i);
  }
}
