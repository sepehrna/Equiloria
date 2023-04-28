import Condition from "./Condition";
import {ColumnType} from "./ColumnType";

export default class BuilderUtils {

    public static createFieldsString(fields: string | string[]) {
        return Array.isArray(fields) ? fields.join(', ') : fields;
    }

    public static buildWhereClause(conditions: Condition[]): string {
        let where = '';
        if (conditions && conditions.length > 0) {
            where = 'WHERE ';
            for (let i = 0; i < conditions.length; i++) {
                const condition = conditions[i];
                let statement = condition.columnType && condition.columnType === ColumnType.TEXT
                    ? `${condition.column} = '${condition.value}'`
                    : `${condition.column} = ${condition.value}`;
                where += statement;
                if (i < conditions.length - 1) {
                    where += ' AND '
                }
            }
        }
        return where
    }
}