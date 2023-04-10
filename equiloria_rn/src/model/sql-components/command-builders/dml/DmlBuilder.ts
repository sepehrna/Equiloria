import Condition from "../Condition";
import CommandBuilder from "../CommandBuilder";
import BuilderUtils from "../BuilderUtils";
import Column from "../Column";

export default abstract class DmlBuilder implements CommandBuilder {
    protected _tableName: string;
    protected columns: Column[];
    protected conditions: Condition[];

    constructor() {
        this._tableName = '';
        this.columns = [];
        this.conditions = [];
    }

    public abstract build(): string;

    public tableName(tableName: string): DmlBuilder {
        this._tableName = tableName;
        return this;
    }

    public column(column: string, value: any): DmlBuilder {
        this.columns.push({column, value});
        return this;
    }

    public where(column: string, value: any): DmlBuilder {
        this.conditions.push({column, value});
        return this;
    }

    protected buildWhere(): string {
        return BuilderUtils.buildWhereClause(this.conditions)
    }

}
