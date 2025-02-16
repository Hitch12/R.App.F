import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataGridComponent } from "./shared/components/dataGrid/dataGrid.component";
import { PrimeNG } from 'primeng/config'
import { Tools } from './shared/service/Tools';
import { ToasterComponent } from "./shared/components/Toaster/Toaster.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'R.App.F';
  constructor(private primeng: PrimeNG, private _tools: Tools) {

  }
  ngOnInit() {
    this.primeng.zIndex = {
      modal: 1100,    // dialog, sidebar
      overlay: 1000,  // dropdown, overlaypanel
      menu: 1000,     // overlay menus
      tooltip: 1100   // tooltip
    };
  }
  selectData() {
  }
  ngAfterViewInit() {

  }
}
