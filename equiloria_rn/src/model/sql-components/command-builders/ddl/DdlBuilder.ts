import CommandBuilder from "../CommandBuilder";

export default abstract class DdlBuilder implements CommandBuilder {

    protected _tableName: string

    constructor() {
        this._tableName = ''
    }

    abstract build(): string
}