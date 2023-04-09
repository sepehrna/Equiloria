export enum ColumnType {
    INTEGER = "INTEGER"
    , TEXT = "TEXT"
    , REAL = "REAL"
    , BLOB = "BLOB"
}

interface ColumnDefinition {
    name: string;
    type: ColumnType;
    primaryKey?: boolean;
    autoIncrement?: boolean;
    notNull?: boolean;
    unique?: boolean;
    defaultValue?: any;
    foreignKey?: string;

}