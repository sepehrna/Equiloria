import {ColumnType} from "./ColumnType";

export default interface Condition {
    column: string
    value: any
    columnType?: ColumnType
}