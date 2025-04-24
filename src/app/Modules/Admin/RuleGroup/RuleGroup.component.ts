import { Component, OnInit, ViewChild } from '@angular/core';
import { GetAddEditDeleteComponent } from "../../../shared/pages/get-add-edit-delete/get-add-edit-delete.component";
import { Column } from '../../../shared/components/dataGrid/Column';
import { NgIf } from '@angular/common';
import { Tools } from '../../../shared/service/Tools';
import { DataGridComponent, GridAction } from '../../../shared/components/dataGrid/dataGrid.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-RuleGroup',
  templateUrl: './RuleGroup.component.html',
  styleUrls: ['./RuleGroup.component.css'],
  imports: [GetAddEditDeleteComponent, NgIf]
})
export class RuleGroupComponent implements OnInit {
  Columns: Array<Column> = [];
  @ViewChild('CardOperation') CardOperation!: GetAddEditDeleteComponent
  constructor(private _tools: Tools) { }

  ngOnInit() {
    this.Columns.push(new Column('ID', "الكود", "lapel", "text"))
    this.Columns.push(new Column('NAME', "اسم المجموعة", "text", "text"))
    this.Columns.push(new Column('IS_ACTIVE', "مفعل اام لا", "yes-no", "yes-no"))
  }
  async ngAfterViewInit() {
    let Promotions = await this._tools.getAsync("RuleGroup/GetPromotions") as Array<any>;
    this._tools.waitExecuteFunction(100, () => {
      this.CardOperation.grid.Columns = this.Columns
      this.CardOperation.grid.IsHasChild = true;
      // this.CardOperation.grid.onSaveChanges = (e: any) => this.SaveData(e, this.CardOperation.grid)
      this.CardOperation.grid.onLoadedChildDataGrid = (parent, child, row) => {
        let columns: Array<Column> = []
        columns.push(new Column("LAPEL", "اسم الصلاحية"))
        columns.push(new Column("IsActive", "مفعل", "yes-no"))
        columns.push(new Column("VALUES", "الخصائص", "multiSelectObjectMode"))
        columns[columns.length - 1].columnMultiPlaceholder = "اختر الخصائص";
        columns[columns.length - 1].columnMultiOptionLabel = "NAME";
        columns[columns.length - 1].columnMultiSelectOptionValue = "ID";
        columns[columns.length - 1].columnMultiSelectDataSource = [{ ID: 1, NAME: "عرض" }, { ID: 2, NAME: "اضافة" }, { ID: 3, NAME: "تعديل" }, { ID: 4, NAME: "حذف" }]
        child.Columns = columns;
        child.AllowDelete = false;
        child.AllowEdit = false;
        child.AllowSave = false;
        child.AllowAdd = false;
        child.AllowUpdate = false;
        child.AllowDeleteSelected = false;
        child.canSelectRow = false;
        child.canSelectedSomeColumns = false;
        let data = this._tools.cloneObject(Promotions)
        child.dataSource = data
        this.editDataShowing(data, row)
        child.onGridAction = (E) => {
          this.editDataSaving(E, row)
        }
      }
    })
  }
  async update(Td: Table) {
    let Promotions = await this._tools.getAsync("RuleGroup/GetPromotions") as Array<any>;
    this.Columns[5].columnMultiSelectDataSource = Promotions;
  }
  editDataShowing(MainData: Array<any>, Rule: any) {
    if (Rule.PREMOTION_RULEGROUPDTO == null) {
      Rule.PREMOTION_RULEGROUPDTO = [];
    }
    MainData.forEach(item => {
      let isActiveItem = (Rule.PREMOTION_RULEGROUPDTO as Array<any>).find(x => x.PERMITION_ID == item.ID)
      if (isActiveItem != null) {
        item.IsActive = true
        item.VALUES = this.GetValues(isActiveItem);
      }
    })
  }
  editDataSaving(E: GridAction, Rule: any) {
    if (E.COLUMN.columnType == "yes-no") {
      if (E.EVENT.checked == true) {
        let newRole = { IS_WORK: true, OPTIONS: '{"GET":true,"PUT":true,"POST":true,"DELETE":true}', PERMITION_ID: E.itemEdit.ID, RULEGROUP_ID: Rule.ID };
        E.itemEdit.VALUES = this.GetValues(newRole);
        (Rule.PREMOTION_RULEGROUPDTO as Array<any>).push(newRole)
      }
      else {
        Rule.PREMOTION_RULEGROUPDTO = (Rule.PREMOTION_RULEGROUPDTO as Array<any>).filter(z => z.PERMITION_ID != E.itemEdit.ID);
        E.itemEdit.VALUES = [];
      }
    }
    if (E.COLUMN.columnType == "multiSelectObjectMode") {
      let EditItem = (Rule.PREMOTION_RULEGROUPDTO as Array<any>).find(z => z.PERMITION_ID == E.itemEdit.ID)
      if (EditItem != null) {
        EditItem.OPTIONS = this.SetOptions(E.itemEdit.VALUES);
      }
    }
  }
  GetValues(ActiveItem: any): Array<any> {
    let result: Array<any> = [];
    if (ActiveItem.OPTIONS != null) {
      let OPTIONS = JSON.parse(ActiveItem.OPTIONS)
      if (OPTIONS.GET == true) {
        result.push({ ID: 1, NAME: "عرض" })
      }
      if (OPTIONS.POST == true) {
        result.push({ ID: 2, NAME: "اضافة" })
      }
      if (OPTIONS.PUT == true) {
        result.push({ ID: 3, NAME: "تعديل" })
      }
      if (OPTIONS.DELETE == true) {
        result.push({ ID: 4, NAME: "حذف" })
      }
    }
    return result;
  }
  SetOptions(Options: Array<any>): string {
    let option = { "GET": false, "PUT": false, "POST": false, "DELETE": false };
    if (Options.map(z => z.ID).includes(1)) {
      option.GET = true;
    }
    if (Options.map(z => z.ID).includes(2)) {
      option.POST = true;
    }
    if (Options.map(z => z.ID).includes(3)) {
      option.PUT = true;
    }
    if (Options.map(z => z.ID).includes(4)) {
      option.DELETE = true;
    }
    return JSON.stringify(option);
  }
  async SaveData(e: any, Grid: DataGridComponent) {
    // let data: any = await this._tools.putAsync('RuleGroup/EditMore', Grid.dataSource)
    // Grid.dataSource = data != null ? data : [];
  }
}
