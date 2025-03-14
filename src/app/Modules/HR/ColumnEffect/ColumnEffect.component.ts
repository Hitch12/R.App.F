import { Component, OnInit, ViewChild } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { NgIf } from '@angular/common';
import { Column } from '../../../shared/components/dataGrid/Column';
import { CustomColumnDirective } from '../../../shared/components/dataGrid/CustomColumn.directive';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";

@Component({
  selector: 'app-ColumnEffect',
  templateUrl: './ColumnEffect.component.html',
  styleUrls: ['./ColumnEffect.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf, FormsModule, CustomColumnDirective, ButtonModule, CheckboxModule, DialogModule, FloatLabelModule, DataGridComponent, ComboBoxComponent]
})
export class ColumnEffectComponent implements OnInit {

  showDialog: boolean = false;
  @ViewChild("curd") curd!: GetAddEditDeleteComponent;
  Columns: Array<Column> = [];
  Columns_Setting: Array<Column> = [];
  constructor() { }
  CONFIGURATION = { "API_CALLING": "Employee", "FOCUS_PROPERTY": "CODE", "REQUIRED": true, "ArrayOfValues": [], ShowValue: "" }
  ngOnInit() {
    this.Columns.push(new Column("ID", "رقم البند"))
    this.Columns.push(new Column("COLUMN_NAME", "اسم البند", "text", "text", 200))
    this.Columns.push(new Column("TYPE", "نوع البند", "comboBox", "comboBox", 200))
    this.Columns.push(new Column("CONFIGURATION_Edit", "تهيئة", "custom"))
    this.Columns[2].columnComboBoxDataSource = [
      { "ID": 1, "NAME": " كود موظف" },
      { "ID": 2, "NAME": "اسم موظف" },
      { "ID": 3, "NAME": "نص صغير" },
      { "ID": 4, "NAME": "نص تفصيلي" },
      { "ID": 5, "NAME": "تاريخ" },
      { "ID": 6, "NAME": "نعم ام لا" },
      { "ID": 7, "NAME": "قيمة من قائمة" },
      { "ID": 8, "NAME": "اكثر من قيمة من قائمة" },
    ]
    this.Columns[2].columnComboBoxOptionLabel = "NAME";
    this.Columns[2].columnComboBoxOptionValue = "ID";
    this.Columns[2].columnComboBoxPlaceholder = "اختر نوع البند"
    this.Columns[2].columnComboBoxChange = (e: any, item) => {
      item.CONFIGURATION = JSON.stringify(this.CONFIGURATION);
      switch (e.ID) {
        case 1:
          item.CONFIGURATION = JSON.stringify(this.CONFIGURATION);
          break;
        case 2:
          this.CONFIGURATION.FOCUS_PROPERTY = "NAME"
          item.CONFIGURATION = JSON.stringify(this.CONFIGURATION);
          break;
      }
    }
    this.Columns_Setting.push(new Column("ID", "الرقم", "number"))
    this.Columns_Setting.push(new Column("NAME", "الأسم", "text"))
    this.Columns_Setting.push(new Column("VALUE", "القيمة", "text"))
  }
  setValue(item: any, event: boolean) {
    let CONFIGURATION = JSON.parse(item.CONFIGURATION);
    CONFIGURATION.REQUIRED = event
    item.CONFIGURATION = JSON.stringify(CONFIGURATION)
  }
  getValue(item: any) {
    return JSON.parse(item.CONFIGURATION).REQUIRED
  }

  openSetting(item: any) {
    this.CONFIGURATION = JSON.parse(item.CONFIGURATION)
    if (this.CONFIGURATION.ArrayOfValues == undefined) {
      this.CONFIGURATION.ArrayOfValues = [];
    }

    this.showDialog = true;
    (this as any)["old_Item"] = item;
  }
  confirmSetting(dataGrid: DataGridComponent | null) {
    if ((this as any)["old_Item"] != undefined && dataGrid == null) {
      (this as any)["old_Item"].CONFIGURATION = JSON.stringify(this.CONFIGURATION)
    }
    else if (dataGrid != null) {
      dataGrid.onSaveChanges = async () => {
        this.confirmSetting(null);
        dataGrid.selectedItems = [];
        this.showDialog = false;
        if (this.curd != null) {
          this.curd.saveChanges();
        }
      }
    }
  }
}
