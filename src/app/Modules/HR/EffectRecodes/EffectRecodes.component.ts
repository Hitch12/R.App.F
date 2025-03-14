import { Component, OnInit, ViewChild } from '@angular/core';
import { DataGridComponent } from "../../../shared/components/dataGrid/dataGrid.component";
import { Tools } from '../../../shared/service/Tools';
import { Column } from '../../../shared/components/dataGrid/Column';
import { ComboBoxComponent } from "../../../shared/components/comboBox/comboBox.component";
import { DateTimeComponent } from "../../../shared/components/DateTime/DateTime.component";
import { InputLabelComponent } from "../ColumnEffect/TextLabel/InputLabel.component";
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-EffectRecodes',
  templateUrl: './EffectRecodes.component.html',
  styleUrls: ['./EffectRecodes.component.css'],
  standalone: true,
  imports: [DataGridComponent, ButtonModule, ComboBoxComponent, DateTimeComponent, InputLabelComponent]
})
export class EffectRecodesComponent implements OnInit {
  @ViewChild('grid') grid!: DataGridComponent
  colsInfo: Array<any> = [];
  effects: Array<any> = [];
  effectSearch: any = {};
  constructor(private _tools: Tools) { }
  async ngOnInit() {
    this.effects = await this._tools.getAsync("EffectInSystem") as Array<any>
    this.colsInfo = await this._tools.getAsync("EffectColumn") as Array<any>;
  }
  ngAfterViewInit() {
    this._tools.waitExecuteFunction(100, () => {
      this.grid.dataKey = "EF_ID";
      this.grid.AllowSave = false;
      this.grid.AllowUpdate = false;
      this.grid.AllowAdd = false;
      this.grid.onDeleteItem = async (record: any) => {        
        if (record.CALCULATED == false) {
          let result = await this._tools.deleteAsync(`Effect/DeleteEffect?id=${record.EF_ID}`,{}) as any;
          if (result == true) {
            this.grid.dataSource=this.grid.dataSource.filter(x=>x.EF_ID!=record.EF_ID)
            this.grid.dt.reset();
            this._tools.Toaster.showSecondary("تم الحذف بنجاح")
          }
          else
          {
            this._tools.Toaster.showError("حدث خطأ في الأتصال")
          }
        }
        else
        {
          this._tools.Toaster.showError("تم حساب هذا المؤثر لا يمكن حذفة")
        }
      };
      this.grid.DeleteSelectedData=async ()=>{
        let result = await this._tools.deleteAsync(`Effect/DeleteEffects`,this.grid.selectedItems.map(x=>x.EF_ID)) as any;
        if (result == true) {
          this._tools.Toaster.showSecondary("تم حذف المحدد بنجاح")
          this.grid.dataSource = this.grid.dataSource.filter(x => this.grid.selectedItems.includes(x) == false);
          this.grid.dt.reset();
        }
        else
        {
          this._tools.Toaster.showError("حدث خطأ في الأتصال")
        }
      }
      this.grid.dataSource = [];
    })
  }
  addNewEffect() {
    this._tools._router.navigate(["Main", "Effects", "Add"])
  }
  async search() {
    this.effectSearch.start = this._tools.EditData(this.effectSearch.start).toLocaleDateString("en")
    this.effectSearch.end = this._tools.EditData(this.effectSearch.end).toLocaleDateString("en")
    this.grid.IsLoading = true;
    let data = await this._tools.getAsync(`Effect/GetEffectsSaved?from=${this.effectSearch.start}&to=${this.effectSearch.end}&system_Effiect_ID=${this.effectSearch.TypeEffect.ID}`) as any;
    this.grid.Columns = [];
    this.grid.Columns.push(new Column("index", "مسلسل"));
    this.grid.Columns.push(new Column("EMP_CODE", "كود الموظف"));
    this.grid.Columns.push(new Column("EMP_NAME", "اسم الموظف"));
    this.grid.Columns.push(new Column("DEPART_NAME", "قسم الموظف"));
    this.grid.Columns.push(new Column("EF_VALUE", "قيمة الموئثر"));
    this.grid.Columns.push(new Column("RECORD_DATE", "تاريخ التسجيل"));
    this.grid.Columns.push(new Column("EF_DATE", "شهر التطبيق"));
    (data.COLUMNS_DB as Array<any>).forEach(col => {
      this.grid.Columns.push(new Column("val_" + col.ID, col.COLUMN_NAME))
    });
    this.grid.IsLoading = false;
    let source: Array<any> = [];
    (data.EFFECTS_DB as Array<any>).forEach(ef => {
      ef.VALUES = (data.VALUES_DB as Array<any>).filter(x => x.EFFECT_ID == ef.ID);
      let record: any = {};
      record.index = source.length + 1;
      record.EF_ID = ef.ID;
      record.EMP_ID = ef.EMPLOY_ID;
      record.EF_VALUE = ef.EFFECT_VALUE;
      record.CALCULATED = ef.CALCULATED;
      record.EF_DATE = this._tools.EditFormateData(ef.EFFECT_DATE, "dd-MM-yyyy");
      record.RECORD_DATE = this._tools.EditFormateData(ef.DATE_TIME, "dd-MM-yyyy hh:mm:ss");
      record.EMP_NAME = (data.EMPLOYS_DB as Array<any>).find(x => x.ID == ef.EMPLOY_ID).NAME;
      record.EMP_CODE = (data.EMPLOYS_DB as Array<any>).find(x => x.ID == ef.EMPLOY_ID).CODE;
      record.DEPART_ID = (data.EMPLOYS_DB as Array<any>).find(x => x.ID == ef.EMPLOY_ID).DEPART_ID;
      record.DEPART_NAME = (data.DEPARTS_DB as Array<any>).find(x => x.ID == record.DEPART_ID).NAME;
      (data.COLUMNS_DB as Array<any>).forEach(col => {
        record["val_" + col.ID] = JSON.parse((ef.VALUES as Array<any>).find(x => x.EFFECT_COLUMN_ID == col.ID)?.VALUE ?? `""`)
      });
      source.push(record);
    });
    this.grid.dataSource = source;
  }
}
