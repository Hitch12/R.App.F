import { Component, OnInit, ViewChild } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Tools } from '../../../shared/service/Tools';
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { EmployeSelectionComponent } from "../EmployeSelection/EmployeSelection.component";
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { InputLabelComponent } from "../ColumnEffect/TextLabel/InputLabel.component";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { StepperModule } from 'primeng/stepper';
@Component({
  selector: 'app-Effect',
  templateUrl: './Effect.component.html',
  styleUrls: ['./Effect.component.css'],
  imports: [InputLabelComponent, StepperModule, DataGridComponent, CheckboxModule, ToggleSwitchModule, IftaLabelModule, FormsModule, ComboBoxComponent, InputTextModule, InputNumberModule, EmployeSelectionComponent, NgIf, NgFor, ButtonModule]
})
export class EffectComponent implements OnInit {
  @ViewChild('grid') grid!: DataGridComponent
  employ: Array<any> = [];
  effects: Array<any> = [];
  awaySetMony: boolean = true;
  calcByHours: boolean = false;
  colsInfo: Array<any> = [];
  Columns: Array<Column> = [];
  selectedEmployee: Array<any> = [];
  effectSelected: any = { "COLUMNS": [], EFFECT_INFO: null }
  effectPage: any = {};
  constructor(private _tools: Tools) { }

  async ngOnInit() {
    this.effects = await this._tools.getAsync("EffectInSystem") as Array<any>
    this.colsInfo = await this._tools.getAsync("EffectColumn") as Array<any>;
  }
  async selectChange(effect: any) {
    this.Columns = [];
    this.effectSelected.COLUMNS = [];
    this.effectSelected.EFFECT_INFO = effect;
    this.effectSelected.EFFECT_INFO.EFFECT_DATE_MONTH_FROM = new Date().getMonth();
    this.effectSelected.EFFECT_INFO.EFFECT_DATE_YEAR_FROM = new Date().getFullYear();
    this.effectSelected.EFFECT_INFO.Count = 1;

    (effect.COLUMNS as Array<any>).forEach((col, index) => {
      let col_data = this.ColumnInfo(col);
      col_data.CONFIGURATION = col_data.CONFIGURATION != "" && typeof col_data.CONFIGURATION == "string" ? JSON.parse(col_data.CONFIGURATION) : col_data.CONFIGURATION == "" ? null : col_data.CONFIGURATION
      this.effectSelected.COLUMNS.push(this.ColumnInfo(col))
    })
    this._tools.waitExecuteFunction(100, () => {
      if (this.grid) {
        this.grid.Columns = [];
        this.grid.canSelectedSomeColumns = false;
        this.grid.AllowUpdate = false;
        this.grid.AllowAdd = false;

        this.grid.onSaveChanges = async () => {
          this.grid.dataSource.forEach(ef => {
            let sender: any = {};
            sender.DATE_TIME = new Date();
          });
        }

        this.grid.Columns.push(new Column("CODE", "الكود"))
        this.grid.Columns.push(new Column("NAME", "الأسم"))
        this.grid.Columns.push(new Column("DEPART", "القسم"))
        this.grid.Columns.push(new Column("EFFECT_DATE", "تاريخ التطبيق"))
        this.grid.Columns.push(new Column("value", "القيمة", "number", "numeric"));
        (this.effectSelected.COLUMNS as Array<any>).forEach(async col => {
          let columnConfig = new Column("val_" + col.ID, col.COLUMN_NAME)
          switch (col.TYPE) {
            case 1:
            case 2:
              columnConfig.apiPathDataSource = col.CONFIGURATION.API_CALLING;
              columnConfig.columnComboBoxDataSource = await this._tools.getAsync(col.CONFIGURATION.API_CALLING) as Array<any>
              columnConfig.columnComboBoxOptionLabel = col.CONFIGURATION.FOCUS_PROPERTY;
              columnConfig.columnComboBoxOptionValue = col.CONFIGURATION.FOCUS_PROPERTY;
              columnConfig.columnComboBoxPlaceholder = col.COLUMN_NAME;
              columnConfig.columnType = "comboBox";
              break;
            case 3:
              columnConfig.columnType = "text";
              break;
            case 4:
              columnConfig.columnType = "textarea";
              break;
            case 5:
              columnConfig.columnType = "dateTime";
              break;
          }
          this.grid.Columns.push(columnConfig);
        });
        this.grid.dataSource = [];
        this.grid.Columns[3].Style_Show = (e: Date) => {
          return e.toLocaleDateString("en")
        }
      }
    });

  }
  ColumnInfo(col: any) {
    return this.colsInfo.find(x => x.ID == col.EFFECT_COLUMN_ID);
  }
  getTypeColumn(col: any, column: Column) {
    column.columnType = "text";
    column.width = 100;
  }
  afterSelected(e: any) {
    this.selectedEmployee = e;
  }
  addEffect() {
    for (let index = 0; index < this.effectSelected.EFFECT_INFO.Count; index++) {
      this.selectedEmployee.forEach(emp => {
        let empInput = this._tools.cloneObject(emp);
        empInput.value = this.effectSelected.EFFECT_INFO.Value ?? 0;
        (this.effectSelected.COLUMNS as Array<any>).forEach(col => {
          empInput["val_" + col.ID] = col.value;
        });
        empInput.EFFECT_DATE = new Date(this.effectSelected.EFFECT_INFO.EFFECT_DATE_YEAR_FROM, this.effectSelected.EFFECT_INFO.EFFECT_DATE_MONTH_FROM + index, 1)
        this.grid.dataSource.push(empInput);
      })
    }
  }
}
