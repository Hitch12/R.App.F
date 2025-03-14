import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataGridComponent } from "./shared/components/dataGrid/dataGrid.component";
import { PrimeNG } from 'primeng/config'
import { Tools } from './shared/service/Tools';
import { ToasterComponent } from "./shared/components/Toaster/Toaster.component";
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DatePipe],
})
export class AppComponent {
  title = 'R.App.F';
  constructor(private primeng: PrimeNG, private _tools: Tools,private _dateFormat: DatePipe) {

  }
  ngOnInit() {
    this.primeng.zIndex = {
      modal: 1100,    // dialog, sidebar
      overlay: 1000,  // dropdown, overlaypanel
      menu: 1000,     // overlay menus
      tooltip: 1100   // tooltip
    };
    this._tools._dateFormat=this._dateFormat;
  }
  selectData() {
  }
  ngAfterViewInit() {
  }
}
