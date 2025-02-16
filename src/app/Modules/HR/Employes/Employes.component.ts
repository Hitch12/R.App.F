import { Component, OnInit } from '@angular/core';
import { GetAddEditDeleteComponent } from '../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component';
import { Column } from '../../../shared/components/dataGrid/Column';
import { Tools } from '../../../shared/service/Tools';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-Employes',
  templateUrl: './Employes.component.html',
  styleUrls: ['./Employes.component.css'],
  standalone: true,
  imports: [GetAddEditDeleteComponent,NgIf]
})
export class EmployesComponent implements OnInit {
  Columns: Array<Column> = [];
  constructor(private _tools: Tools) { }

  async ngOnInit() {
    let Places = await this._tools.getAsync("Place") as Array<any>
    let Mangements = await this._tools.getAsync("Mangement") as Array<any>
    let Departs = await this._tools.getAsync("Depart") as Array<any>
    this.Columns.push(new Column("ID", "رقم النظام"))
    this.Columns.push(new Column("CODE", "الكود", "text"))
    this.Columns.push(new Column("NAME", "الأسم", "text"))
    this.Columns.push(new Column("DATE_COME", "تاريخ التعين", "dateTime","date"))
    this.Columns.push(new Column("DATE_OUT", "تاريخ الانتهاء", "dateTime","date"))
    this.Columns.push(new Column("CRROS_SALARY", "الراتب", "number"))
    this.Columns.push(new Column("NATIVE_SALARY", "صافي الراتب", "number"))
    this.Columns.push(new Column("IS_ISSUE", "مؤمن علية",  "yes-no"))
    this.Columns.push(new Column("DEPART_ID", "القسم", "comboBox","comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر القسم"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = Departs;
    this.Columns.push(new Column("POSATION_ID", "المكانة الوظيفية", "comboBox","comboBox"))
    this.Columns[this.Columns.length - 1].columnComboBoxOptionLabel = "POSATION";
    this.Columns[this.Columns.length - 1].columnComboBoxOptionValue = "ID";
    this.Columns[this.Columns.length - 1].columnComboBoxPlaceholder = "اختر الوظيفة"
    this.Columns[this.Columns.length - 1].columnComboBoxDataSource = Mangements;
    this.Columns.push(new Column("PLACES", "اماكن العمل", "multiSelect","comboBox"))
    this.Columns[this.Columns.length - 1].columnMultiOptionLabel = "NAME";
    this.Columns[this.Columns.length - 1].columnMultiSelectpropertyBind = "PLACES";
    this.Columns[this.Columns.length - 1].columnMultiSelectOptionValue = "PLACE_ID";
    this.Columns[this.Columns.length - 1].columnMultiSelectselectIdKey = "EMPLOYEE_ID";
    this.Columns[this.Columns.length - 1].columnMultiPlaceholder = "اختر مكان العمل"
    this.Columns[this.Columns.length - 1].columnMultiSelectDataSource = Places;
    this.Columns.forEach(col=>{
      col.width=200;
    })
    this.Columns[0].width=80;
  }
  async update() {
    let Places = await this._tools.getAsync("Place") as Array<any>
    let Mangements = await this._tools.getAsync("Mangement") as Array<any>
    let Departs = await this._tools.getAsync("Depart") as Array<any>

    this.Columns[8].columnComboBoxDataSource = Departs;
    this.Columns[9].columnComboBoxDataSource = Mangements;
    this.Columns[10].columnMultiSelectDataSource = Places;
  }
}
