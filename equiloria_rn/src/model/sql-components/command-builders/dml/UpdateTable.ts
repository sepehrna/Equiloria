import DmlBuilder from "./DmlBuilder";

export default class UpdateTable extends DmlBuilder {

    build(): string {
        const set = Object.keys(this.values).map(column => `${column} = ?`).join(', ')
        return `UPDATE ${this._tableName} SET ${set} ${this.buildWhere()};`
    }
}