import DmlBuilder from "./DmlBuilder";

export class InsertInto extends DmlBuilder{

    protected value(column: string, value: any): DmlBuilder {
        return super.value(column, value);
    }

    build(): string {
        const columns = Object.keys(this.values).join(', ');
        const placeholders = Object.keys(this.values).map(() => '?').join(', ');
        return `INSERT INTO ${this._tableName} (${columns})+' VALUES '+(${placeholders});`;
    }

}