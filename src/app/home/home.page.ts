import { Component , OnInit , ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage{
  isDisplay : boolean = false;
  constructor() {}

  openShopList(){
    const lister = document.getElementById("lister");
    if (lister){
      if (this.isDisplay) {lister.style.marginTop = "0";}
      else {lister.style.marginTop = "17rem";}
    };
    this.isDisplay = !this.isDisplay;
  };
}