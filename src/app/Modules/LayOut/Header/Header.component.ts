import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NaveComponent } from '../Nave/Nave.component';

@Component({
  selector: 'app-Header',
  templateUrl: './Header.component.html',
  styleUrls: ['./Header.component.css'],
  standalone: true,
  imports: [ButtonModule]
})
export class HeaderComponent implements OnInit {
  @Input('Nave') _Nave!:NaveComponent
  constructor() { }

  ngOnInit() {
  }
  openNave() {
    this._Nave.showNave = true
  }
}
