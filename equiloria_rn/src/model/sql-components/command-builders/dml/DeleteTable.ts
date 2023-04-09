import DmlBuilder from "./DmlBuilder";

export default class DeleteTable extends DmlBuilder {
    public where(column: string, value: any): DmlBuilder {
        return super.where(column, value);
    }

    build(): string {
        return `DELETE FROM ${this._tableName} ${this.buildWhere()};`;
    }
}