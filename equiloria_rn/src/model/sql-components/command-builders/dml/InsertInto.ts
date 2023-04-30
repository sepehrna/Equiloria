import DmlBuilder from "./DmlBuilder";

export class InsertInto extends DmlBuilder {

    column(column: string, value: any): DmlBuilder {
        return super.column(column, value);
    }

    public build(): string {
        const columnNames = this.columns
            .map(element => `'${element.column}' `)
            .join(', ');
        const columnValues = this.columns
            .map(element => `${element.value} `)
            .join(', ');
        return `INSERT INTO ${this._tableName} (${columnNames}) VALUES (${columnValues});`;
    }

}