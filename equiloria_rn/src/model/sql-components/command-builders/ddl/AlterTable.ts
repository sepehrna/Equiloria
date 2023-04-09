import DdlBuilder from "./DdlBuilder";

export default class AlterTable extends DdlBuilder {

    private readonly columns: ColumnDefinition[] = [];

    public tableName(tableName: string): AlterTable {
        this._tableName = tableName;
        return this;
    }

    column(name: string, type: ColumnType): AlterTable {
        this.columns.push({name, type});
        return this;
    }

    primaryKey(): AlterTable {
        const lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn) {
            lastColumn.primaryKey = true;
        }
        return this;
    }

    autoIncrement(): AlterTable {
        const lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn) {
            lastColumn.autoIncrement = true;
        }
        return this;
    }

    notNull(): AlterTable {
        const lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn) {
            lastColumn.notNull = true;
        }
        return this;
    }

    unique(): AlterTable {
        const lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn) {
            lastColumn.unique = true;
        }
        return this;
    }

    defaultValue(value: any): AlterTable {
        const lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn) {
            lastColumn.defaultValue = value;
        }
        return this;
    }

    foreignKey(reference: string): AlterTable {
        const lastColumn = this.columns[this.columns.length - 1];
        if (lastColumn) {
            lastColumn.foreignKey = reference;
        }
        return this;
    }

    build(): string {
        let sql = `ALTER TABLE ${this._tableName}\n`;

        for (let i = 0; i < this.columns.length; i++) {
            const column = this.columns[i];
            sql += `  ADD COLUMN ${column.name} ${column.type}`;

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

            if (column.foreignKey) {
                sql += ` REFERENCES ${column.foreignKey}`;
            }

            if (i < this.columns.length - 1) {
                sql += ',\n';
            } else {
                sql += '\n';
            }
        }

        sql += `;\n`;

        return sql;
    }
}
