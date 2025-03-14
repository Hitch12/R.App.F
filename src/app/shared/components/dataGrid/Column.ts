import { TemplateRef } from "@angular/core"
import { MultiselectComponent } from "../multiselect/multiselect.component"

export class Column {
    constructor(
        public name: string = '',
        public header: string = '',
        public columnType: "text" | "number" | "lapel" | "dateTime" | "custom" | "comboBox" | "multiSelect"|"multiSelectObjectMode"| "yes-no" | "textarea" = "lapel",
        public filterType: "text" | "numeric" | "boolean" | "date" | "comboBox" | "yes-no" | "none" = "text",
        public width: number = 100,
        public frozen: boolean = false
    ) {
    }
    apiPathDataSource: string = ''
    columnComboBoxOptionLabel: string = ''
    columnComboBoxOptionValue: string = ''
    columnComboBoxPlaceholder: string = ''
    columnComboBoxDataSource: Array<any> = []
    columnComboBoxChange(selectNewItem: any, rowItem: any) {

    }

    columnMultiOptionLabel: string = ''
    columnMultiPlaceholder: string = ''
    columnMultiSelectpropertyBind: string = ''
    columnMultiSelectselectIdKey: string = ''
    columnMultiSelectOptionValue: string = ''
    columnMultiSelectDataSource: Array<any> = []
    columnMultiSelectChange(multiSelect: MultiselectComponent, rowItem: any) {

    }
    Style_Show(value: any) :string{
        return value
    }
    templateColumn!: TemplateRef<any>

}
