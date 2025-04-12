import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { Tools } from '../../service/Tools';
@Component({
  selector: 'app-DateTime',
  templateUrl: './DateTime.component.html',
  styleUrls: ['./DateTime.component.css'],
  standalone: true,
  imports: [DatePickerModule, FormsModule]
})
export class DateTimeComponent implements OnInit {
  @Input() selectedDate: any = null
  @Input() forceMaxOrEqualDay: boolean = false
  @Input() view: 'date' | 'month' | 'year' = "date"
  @Input() placeholder: string = "أكتب التاريخ ..."
  @Output() selectedDateChange: EventEmitter<any> = new EventEmitter()
  constructor(private _tools: Tools) { }

  ngOnInit() {

  }
  ngOnChanges() {
    if (this.selectedDate) {
      let text = new Date(this.selectedDate).toLocaleDateString("EN") + " GMT";
      this.selectedDate = new Date(text);
    }
  }
  change(e: any) {
    if (e != null) {
      let text = new Date(e).toLocaleDateString("EN") + " GMT";
      this.selectedDate = new Date(text);
      if (this.selectedDate != null && this.forceMaxOrEqualDay) {
        let value = new Date(text);
        value.setDate(1)
        let data_now = new Date(new Date().toLocaleDateString("en") + " GMT")
        data_now.setDate(1);
        if (value < data_now) {
          this._tools.Toaster.showError("يجب ادخال تاريخ اكبر من تاريخ الشهر او يساوي")
          this.selectedDate = null;
          return
        }
      }
      this.selectedDateChange.emit(this.selectedDate)
    }
    else {
      this.selectedDateChange.emit(null);
    }
  }
  clear() {
    this.selectedDate = null;
    this.selectedDateChange.emit(null);
  }
}
