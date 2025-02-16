import { ChangeDetectorRef, Component, ElementRef, inject, Input, OnInit, QueryList, ViewChild, viewChildren, ViewChildren } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ColumnFilter, Table, TableModule } from 'primeng/table';
import { PResizableColumnDirective } from './pResizableColumn.directive';
import { Column } from './Column';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Tools } from '../../service/Tools';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ChildGrid } from './ChildGrid';
import { MultiSelectModule } from 'primeng/multiselect';
import { MultiselectComponent } from '../multiselect/multiselect.component';
import { ComboBoxComponent } from '../comboBox/comboBox.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { DateTimeComponent } from "../DateTime/DateTime.component";
@Component({
  selector: 'app-dataGrid',
  templateUrl: './dataGrid.component.html',
  styleUrls: ['./dataGrid.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    ButtonModule,
    DatePickerModule,
    PResizableColumnDirective,
    DataGridComponent,
    MultiSelectModule,
    ToggleButtonModule,
    ToggleSwitchModule,
    CheckboxModule,
    InputNumberModule,
    IconField, InputIcon, InputTextModule, NgIf, MultiselectComponent, ComboBoxComponent, NgTemplateOutlet,
    DateTimeComponent
  ]
})
export class DataGridComponent implements OnInit {
  @Input() RowParent: any
  ParentZIndex: number = 50;
  _dataSource!: any[];
  @Input() public set dataSource(v: any[]) {
    this._dataSource = v;
  }
  public get dataSource() {
    return this._dataSource;
  }

  @Input() tableStyle: any = {}
  @Input() dataKey: string = "ID";
  private _Columns: Column[] = [];
  public get Columns(): Column[] {
    return this._Columns;
  }

  @Input() set Columns(v: Column[]) {
    this.selectedColumns = v;
    this._Columns = v;
  }



  @Input() searchValue: string = '';
  @Input() AllowAdd: boolean = true;
  childrenGrid: Array<ChildGrid> = []
  @Input() AllowSave: boolean = true;
  @Input() IsLoading: boolean = false;
  @Input() AllowHeaderTemplate: boolean = true;
  @Input() AllowDelete: boolean = true;
  @Input() AllowUpdate: boolean = true;
  @Input() AllowSearch: boolean = true;
  @Input() scrollHeight: string = "flex"
  @Input() ManyRowsInShow: number = 10;
  @Input() IsHasChild: boolean = false;
  @Input() canReOrder: boolean = false;
  @Input() canSelectRow: boolean = false;
  @Input() ParentGrid!: DataGridComponent;
  @Input() selectedItems: Array<any> = [];
  @Input() selectedColumns: Array<any> = [];
  @Input() AllowDeleteSelected: boolean = true;
  @Input() singleSelectedMode: boolean = false;
  @Input() canSelectedSomeColumns: boolean = true;
  @Input() rowsPerPageOptions: Array<any> = [3, 5, 10, 20, 50];
  @Input() selectionMode: 'single' | 'multiple' | undefined | null;
  @ViewChildren('columnFilter') columnFilters!: QueryList<ColumnFilter>
  @ViewChild('dt') dt!: Table

  @ViewChildren(PResizableColumnDirective) appResizableColumns!: QueryList<PResizableColumnDirective>
  public get globalFilterFields(): Array<string> {
    return this.Columns.map(x => x.name)
  }

  public get colSpan(): number {
    let plus = 0;
    plus = this.IsHasChild ? 1 : 0;
    plus = this.canSelectRow ? plus + 1 : plus;
    plus = this.canReOrder ? plus + 1 : plus;
    return this.Columns.length + plus
  }
  
  constructor(private _tools: Tools, private el: ElementRef<HTMLElement>) { }
  ngOnInit() {
    this.canSelectRow = this.AllowDeleteSelected
  }
  async onSaveChanges() {

  }
  async onUpdate(table: Table) {

  }
  ngAfterViewInit() {
    // this.editFilterWork()
    this.el.nativeElement.addEventListener("keydown", (e) => {
      if (!(e.target as HTMLElement).classList.contains("inputText")) {
        this.pInputTextKeyDown(e, { value: "" }, null);
      }
    })
  }
  ngOnChanges() {
    this.canSelectRow = this.AllowDeleteSelected
    let grid = new ChildGrid(this, this.RowParent)
    if (this.ParentGrid && this.RowParent) {
      if (!this.ParentGrid.childrenGrid.map(x => x.item).includes(this.RowParent)) {
        this.ParentGrid.childrenGrid.push(grid);
      }
      else {
        let oldGrid = this.ParentGrid.childrenGrid.find(x => x.item == this.RowParent);
        if (oldGrid) {
          oldGrid.dataGrid = this;
          grid = oldGrid;
        }
      }
      this.ParentGrid.onLoadedChildDataGrid(this.ParentGrid, grid.dataGrid, grid.item)
    }
  }
  // editFilterWork() {
  //   this._tools.waitExecuteFunction(200, () => {
  //     if (this.columnFilters) {
  //       Array.from(this.columnFilters).forEach(columnFilter => {
  //         let txtInput = ((columnFilter.el.nativeElement as HTMLElement).querySelector('[pinputtext]') as HTMLElement);
  //         if (txtInput) {
  //           txtInput.oninput = (e: Event) => {
  //             if (e.target) {
  //               const enterEvent = new KeyboardEvent('keydown', {
  //                 key: 'Enter', // Key identifier
  //                 code: 'Enter', // Physical key on the keyboard
  //                 keyCode: 13, // Numeric code for Enter key
  //                 which: 13, // Compatibility for older browsers
  //                 bubbles: true, // Allow the event to bubble up the DOM
  //                 cancelable: true // Allow event cancellation
  //               });
  //               (e.target as HTMLElement).dispatchEvent(enterEvent);
  //             }
  //           }
  //         }
  //       })
  //       this.tableStyle.width = this.Columns.map(x => x.width).reduce((a, b) => a + b, 200) + 'px'
  //       let table = this.el.nativeElement.querySelector('table');
  //       if (table) {
  //         table.style.width = this.Columns.map(x => x.width).reduce((a, b) => a + b, 200) + 'px';
  //         let thead = this.el.nativeElement.querySelector('thead') as HTMLElement
  //         if (thead) {
  //           thead.style.zIndex = this.ParentGrid ? (this.ParentGrid.ParentZIndex - 1 + '') : (this.ParentZIndex + '')
  //         }
  //       }
  //     }
  //   })

  // }
  DeleteSelectedData() {
    this.dataSource = this.dataSource.filter(x => this.selectedItems.includes(x) == false);
    this.dt.reset();
  }

  onLoadedChildDataGrid(parent: DataGridComponent, ChildGrid: DataGridComponent, RowParentItem: any) {

  }
  async AddNew(table: Table) {
    if (this.dataSource.find(x => Object.entries(x).length == 0) == null) {
      this.dataSource.push({})
      this.IsLoading = true;
      table.reset();
      this.selectLastInput();
    }
  }
  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }
  globalFilter(table: Table, event: any) {
    table.filterGlobal(event.target?.value, 'contains')
  }
  expandedRow(item: any, index: number) {
  }
  onDeleteItem(item: any) {
    this.dataSource.splice(this.dataSource.indexOf(item), 1)
    this.dt.reset();
  }
  selectLastInput() {
    this._tools.waitExecuteFunction(100, () => {
      let btnLastPage = this.el.nativeElement.querySelector(".p-paginator-last") as HTMLElement
      if (btnLastPage) {
        btnLastPage.click();
      }
      this._tools.waitExecuteFunction(100, () => {
        this.IsLoading = false
        let tbody = this.el.nativeElement.querySelector("tbody") as HTMLElement
        if (tbody) {
          let LastRow = Array.from(tbody.children)[Array.from(tbody.children).length - 1] as HTMLElement
          if (LastRow) {
            LastRow.focus()
            let inputText = LastRow.querySelector(".p-inputtext") as HTMLElement
            if (inputText) {
              inputText.focus();
            }
            LastRow.scrollIntoView({ behavior: "smooth" })
          }
        }
      });
    })

  }
  async pInputTextKeyDown(e: KeyboardEvent, inputText: any, item: any) {
    if (e.code == "Enter" && inputText.value != null && inputText.value != "") {
      this.AddNew(this.dt)
    }
    else if (e.code == "NumpadEnter") {
      await this.onSaveChanges();
       this.selectLastInput();
    }
    else if (e.code == "Delete" && item != null) {
      this.onDeleteItem(item);
    }
  }
  editFilterMultiSelectValues(selectedSource: Array<any>, optionValue: string): Array<any> {
    return selectedSource.map(x => x[optionValue])
  }
  onSelectRow(e:any)
  {
  }
  onUnSelectRow(e:any)
  {
  }
  onSelectAllChange(e:any)
  {
  }
}
