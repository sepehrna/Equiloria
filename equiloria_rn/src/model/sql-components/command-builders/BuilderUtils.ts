import Condition from "./Condition";

export default class BuilderUtils {

    public static createFieldsString(fields: string | string[]) {
        return  Array.isArray(fields) ? fields.join(', ') : fields;
    }

    public static buildWhereClause(conditions: Condition[]): string {
        let where = '';
        if (conditions && conditions.length > 0) {
            where = 'WHERE ';
            for (let i = 0; i < conditions.length; i++) {
                const condition = conditions[i];
                where += `${condition.column} = ?`;
                if (i < conditions.length - 1) {
                    where += ' AND '
                }
            }
        }
        return where
    }
}