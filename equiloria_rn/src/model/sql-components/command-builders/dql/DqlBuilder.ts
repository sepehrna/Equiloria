import CommandBuilder from "../CommandBuilder";
import Condition from "../Condition";
import BuilderUtils from "../BuilderUtils";
import OrderBy, {Direction} from "../OrderBy";
import {Entity} from "../../../entities/Entity";
import {ColumnType} from "../ColumnType";

export class DqlBuilder<E extends Entity> implements CommandBuilder {
    private query: string;
    private tableName: string;
    private fields: string[];
    private readonly conditions: Condition[];
    private readonly orderByArray: OrderBy[];
    private limitNumber: number;
    private offsetNumber: number;
    private readonly _entityInstance: E;

    constructor(entityInstance: E) {
        this.query = '';
        this.tableName = '';
        this.fields = [];
        this.conditions = [];
        this.orderByArray = [];
        this.limitNumber = -1;
        this.offsetNumber = -1;
        this._entityInstance = entityInstance;
    }

    select(fields: string | string[]): DqlBuilder<E> {
        let neededFields: string[] = Array.isArray(fields) ? fields : [fields];
        this.fields = this.fields.concat(neededFields);
        return this;
    }


    from(tableName: string): DqlBuilder<E> {
        this.tableName = tableName
        return this;
    }

    where(column: string, value: any): DqlBuilder<E> {
        if (typeof value === 'string') {
            let textType: ColumnType = ColumnType.TEXT;
            this.conditions.push({column, value, columnType: textType})
        } else {
            this.conditions.push({column, value})
        }
        return this;
    }

    orderBy(column: string, direction: Direction): DqlBuilder<E> {
        this.orderByArray.push({column, direction})
        return this;
    }

    limit(limit: number): DqlBuilder<E> {
        this.limitNumber = limit
        return this
    }

    offset(offset: number): DqlBuilder<E> {
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


    get entityInstance(): E {
        return this._entityInstance;
    }

    public build(): string {
        this.buildSelectClause();
        this.query += BuilderUtils.buildWhereClause(this.conditions)
        this.buildOrderByClause()
        this.buildLimitClause();
        this.buildOffsetClause();
        return this.query.trim()
    }

    private buildOffsetClause() {
        if (this.offsetNumber > -1) {
            this.query += ` OFFSET ${this.offsetNumber} `;
        }
    }

    private buildLimitClause() {
        if (this.limitNumber > -1) {
            this.query += ` LIMIT ${this.limitNumber} `;
        }
    }

    private buildSelectClause() {
        let fieldsString = '*';
        if (this.fields) {
            fieldsString = BuilderUtils.createFieldsString(this.fields);
        }
        this.query += `SELECT ${fieldsString} `;
        this.query += `FROM ${this.tableName} `;
    }
}
