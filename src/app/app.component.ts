import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  menu = "recipe";
  menuClicked(menuStr: string) {
    this.menu = menuStr;
  }
}
