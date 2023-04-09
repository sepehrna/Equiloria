import CommandBuilder from "../CommandBuilder";
import Condition from "../Condition";
import BuilderUtils from "../BuilderUtils";
import OrderBy, {Direction} from "../OrderBy";

export class DqlBuilder implements CommandBuilder {
    private query: string;
    private tableName: string
    private readonly fields: string[]
    private readonly conditions: Condition[]
    private readonly orderByArray: OrderBy[]
    private limitNumber: number
    private offsetNumber: number

    constructor() {
        this.query = ''
        this.tableName = ''
        this.fields = []
        this.conditions = []
        this.orderByArray = []
        this.limitNumber = -1;
        this.offsetNumber = -1;
    }

    select(fields: string | string[]): DqlBuilder {
        let neededFields: string[] = Array.isArray(fields) ? fields : [fields]
        this.fields.concat(neededFields)
        return this;
    }


    from(tableName: string): DqlBuilder {
        this.tableName = tableName
        return this;
    }

    where(column: string, value: any): DqlBuilder {
        this.conditions.push({column, value})
        return this;
    }

    orderBy(column: string, direction: Direction): DqlBuilder {
        this.orderByArray.push({column, direction})
        this.query += `ORDER BY ${column} ${direction} `
        return this;
    }

    limit(limit: number): DqlBuilder {
        this.limitNumber = limit
        return this
    }

    offset(offset: number): DqlBuilder {
        this.offsetNumber = offset
        return this;
    }

    private buildOrderByClause() {
        let orderBy = ''
        if (this.orderByArray.length > 0) {
            orderBy = 'ORDER BY '
            for (let i = 0; i < this.orderByArray.length; i++) {
                orderBy += `${this.orderByArray[i].column} `
                orderBy += `${this.orderByArray[i].direction}`
                if (i < this.orderByArray.length - 1) {
                    orderBy += ', '
                }
            }
        }
        this.query += orderBy
    }

    build(): string {
        this.buildSelectClause();
        this.query += BuilderUtils.buildWhereClause(this.conditions)
        this.buildOrderByClause()
        this.buildLimitClause();
        this.buildOffsetClause();
        return this.query.trim()
    }

    private buildOffsetClause() {
        this.query += `OFFSET ${this.offsetNumber} `
    }

    private buildLimitClause() {
        this.query += `LIMIT ${this.limitNumber} `
    }

    private buildSelectClause() {
        let fieldsString = '*'
        if(this.fields) {
            fieldsString = BuilderUtils.createFieldsString(this.fields);
        }
        this.query += `SELECT ${fieldsString} `
        this.query += `FROM ${this.tableName} `
    }
}
