import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Tools } from '../../service/Tools';
import { DataGridComponent } from "../../components/dataGrid/dataGrid.component";
import { Column } from '../../components/dataGrid/Column';
import { HttpClientModule } from '@angular/common/http';
import { CustomColumnDirective } from '../../components/dataGrid/CustomColumn.directive';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-get-add-edit-delete',
  templateUrl: './get-add-edit-delete.component.html',
  styleUrls: ['./get-add-edit-delete.component.css'],
  standalone: true,
  imports: [DataGridComponent, ButtonModule],
})
export class GetAddEditDeleteComponent implements OnInit {
  @ViewChild('grid') grid!: DataGridComponent
  @Input() ApiPage: string = ""
  @Input() header: string = ""
  @Input() Columns: Array<Column> = []
  @Output() onUpdate:EventEmitter<any>=new EventEmitter()
  @Output() onConfigGrid:EventEmitter<DataGridComponent>=new EventEmitter()

  constructor(private _tools: Tools) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      if (this.Columns.length == 0) {
        this.Columns.push(new Column('ID', "الكود", "lapel", "text"))
        this.Columns.push(new Column('NAME', "الأسم", "text", "text", 600))
        this.grid.Columns = this.Columns
      }
      else {
        this.grid.Columns = this.Columns
      }
      this.onConfigGrid.emit(this.grid);
      this.grid.onSaveChanges = () => this.saveChanges();
      this.grid.onUpdate = (e) => this.Update(e);
      this.grid.dataKey = "ID";
      this.grid.dt.loading = true;
      this._tools.getAsync(this.ApiPage).then((data: any) => {
        this.grid.dt.loading = false;
        this.grid.dataSource = data
      })
     
    })
  }
  deleteItem(item: any) {
    this.grid.dataSource.splice(this.grid.dataSource.indexOf(item), 1)
    this.grid.dt.reset();
  }
  async saveChanges() {
    let data: any = await this._tools.putAsync(this.ApiPage + '/EditMore', this.grid.dataSource)
    if (data) {
      this._tools.Toaster.showSuccess("تم التحديث بنجاح");
      this.grid.dataSource = data
      this.onUpdate.emit(data)
    }
    else {
      this._tools.Toaster.showError("رجاء ادخال البيانات بشكل صحيح و كامل");
    }
    return data
  }
  async Update(table: Table) {
    table.loading = true;
    let data: any = await this._tools.getAsync(this.ApiPage)
    if (data) {
      this.grid.dataSource = data
      this.onUpdate.emit(data)
    }
    else {
      this.grid.dataSource = []
      this.onUpdate.emit([])
    }
    table.reset()
    table.loading = false;
    return data
  }
}
