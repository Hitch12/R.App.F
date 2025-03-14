import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
@Component({
  selector: 'app-DateTime',
  templateUrl: './DateTime.component.html',
  styleUrls: ['./DateTime.component.css'],
  standalone: true,
  imports: [DatePickerModule, FormsModule, FloatLabel]
})
export class DateTimeComponent implements OnInit {
  @Input() selectedDate: any = null
  @Input() view: 'date' | 'month' | 'year' = "date"
  @Input() placeholder: string = "أكتب التاريخ ..."
  @Output() selectedDateChange: EventEmitter<any> = new EventEmitter()
  constructor() { }

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
      this.selectedDateChange.emit(this.selectedDate)
    }
  }
}
