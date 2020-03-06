import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store'
import * as ShoppingListAction from './store/shopping-list.actions'
import * as fromApp from '../store/app.reducer'
import { trigger, state, animate, style, transition, group } from '@angular/animations';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  animations: [
    trigger('divIngredient', [
      state('in', style({
        opacity: 1,
      })),
      transition('void => *', [
        style({
          opacity: 0,
          'background-color': '#95d195',
          'color': 'green',
        }),
        animate(300)
      ]),
      transition('* => void', [
        group([
          animate(300, style({
            'background-color': 'pink',
            'color': 'red',
          })),
          animate(600, style({
            opacity: 0
          }))
        ])
      ])
    ])
  ]
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  // ingredientSub: Subscription;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }

  ngOnDestroy() {
    // this.ingredientSub.unsubscribe();
  }
  
  onSelect(i: number) {
    this.store.dispatch(new ShoppingListAction.StartEditing(i))
  }
}
