import {ColumnType} from "../ColumnType";


export interface ColumnDefinition {
    name: string;
    type: ColumnType;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    notNull?: boolean;
    unique?: boolean;
    defaultValue?: any;
    foreignKey?: string;

}