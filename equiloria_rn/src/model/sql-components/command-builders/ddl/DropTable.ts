import DdlBuilder from "./DdlBuilder";

export default class DropTable extends DdlBuilder {

    public tableName(tableName: string): DropTable {
        this._tableName = tableName;
        return this;
    }

    public build(): string {
        return `DROP TABLE IF EXISTS ${this._tableName}`;
    }

}