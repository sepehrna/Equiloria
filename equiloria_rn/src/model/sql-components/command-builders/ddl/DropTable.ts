import DdlBuilder from "./DdlBuilder";

export default class DropTable extends DdlBuilder {

    public tableName(tableName: string): DropTable {
        this._tableName = tableName;
        return this
    }

    build(): string {
        return `DROP TABLE IF EXISTS ${this.tableName}`
    }

}