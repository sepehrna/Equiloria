import Condition from "../Condition";
import CommandBuilder from "../CommandBuilder";
import BuilderUtils from "../BuilderUtils";

export default abstract class DmlBuilder implements CommandBuilder {
    protected _tableName: string
    protected values: { [column: string]: any }
    protected conditions: Condition[]

    constructor() {
        this._tableName = ''
        this.values = []
        this.conditions = []
    }

    abstract build(): string

    public tableName(tableName: string): DmlBuilder {
        this._tableName = tableName
        return this
    }
    public value(column: string, value: any): DmlBuilder {
        this.values.push(column, value)
        return this
    }
    protected where(column: string, value: any): DmlBuilder {
        this.conditions.push({column, value})
        return this
    }

    protected buildWhere(): string {
        return BuilderUtils.buildWhereClause(this.conditions)
    }

}
