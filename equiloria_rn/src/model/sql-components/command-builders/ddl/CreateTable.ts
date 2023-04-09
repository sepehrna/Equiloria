import DdlBuilder from "./DdlBuilder";

export default class CreateTable extends DdlBuilder {

    private readonly columns: ColumnDefinition[] = []

    public tableName(tableName: string): CreateTable {
        this._tableName = tableName;
        return this
    }

    column(name: string, type: ColumnType): CreateTable {
        this.columns.push({name, type});
        return this;
    }

    primaryKey(): CreateTable {
        const lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn) {
            lastColumn.primaryKey = true;
        }
        return this;
    }

    autoIncrement(): CreateTable {
        const lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn) {
            lastColumn.autoIncrement = true;
        }
        return this;
    }

    notNull(): CreateTable {
        const lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn) {
            lastColumn.notNull = true;
        }
        return this;
    }

    unique(): CreateTable {
        const lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn) {
            lastColumn.unique = true;
        }
        return this;
    }

    defaultValue(value: any): CreateTable {
        const lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn) {
            lastColumn.defaultValue = value;
        }
        return this;
    }

    build(): string {
        let sql = `CREATE TABLE ${this._tableName} (\n`;

        for (let i = 0; i < this.columns.length; i++) {
            const column = this.columns[i];
            sql += `  ${column.name} ${column.type}`;

            if (column.primaryKey) {
                sql += ' PRIMARY KEY';
                if (column.autoIncrement) {
                    sql += ' AUTOINCREMENT';
                }
            }

            if (column.notNull) {
                sql += ' NOT NULL';
            }

            if (column.unique) {
                sql += ' UNIQUE';
            }

            if (column.defaultValue !== undefined) {
                sql += ` DEFAULT ${JSON.stringify(column.defaultValue)}`;
            }

            if (i < this.columns.length - 1) {
                sql += ',\n';
            } else {
                sql += '\n';
            }
        }

        sql += `);\n`;

        return sql;
    }
}
