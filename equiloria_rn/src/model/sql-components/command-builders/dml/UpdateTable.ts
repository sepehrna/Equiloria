import DmlBuilder from "./DmlBuilder";

export default class UpdateTable extends DmlBuilder {

    public build(): string {
        const setClause = this.columns.map(element => `${element.column} = ${element.value} `).join(', ')
        return `UPDATE ${this._tableName} SET ${setClause} ${this.buildWhere()};`
    }
}