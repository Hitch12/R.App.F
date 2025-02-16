import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { ComboBoxComponent } from "../../../../shared/components/comboBox/comboBox.component";
import { NgIf } from '@angular/common';
import { DataGridComponent } from "../../../../shared/components/dataGrid/dataGrid.component";
import { DateTimeComponent } from "../../../../shared/components/DateTime/DateTime.component";
import { Tools } from '../../../../shared/service/Tools';
@Component({
  selector: 'app-InputLabel',
  templateUrl: './InputLabel.component.html',
  styleUrls: ['./InputLabel.component.css'],
  standalone: true,
  imports: [IftaLabelModule, FormsModule, InputTextModule, ComboBoxComponent, NgIf, DateTimeComponent]
})
export class InputLabelComponent implements OnInit {
  value: any = null;
  @Input() Effect: any
  @Input() placeholder: string = ""
  constructor(private _tools: Tools, private _el: ElementRef<HTMLElement>) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      this._el.nativeElement.style.display = "block";
      this._el.nativeElement.style.width = this.getWidth();
    });
  }
  ngOnChanges() {
    if (this.Effect && this.Effect.value == undefined) {
      this.Effect.value = null;
    }
  }
  getWidth(): string {
    let width = "200px"
    if (this.Effect) {
      switch (this.Effect.TYPE) {
        case 4:
          width = "100%"
          break;
      }
      return width;
    }
    return '';
  }

}
