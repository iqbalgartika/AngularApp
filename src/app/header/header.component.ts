import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  @Output() menu = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onSelect(selectedMenu:string){
    this.menu.emit(selectedMenu);
  }
  
}
