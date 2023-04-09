import {BaseRepository} from "./BaseRepository";
import {Bill} from "../entities/Bill";
import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {InsertInto} from "../sql-components/command-builders/dml/InsertInto";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";
import AlterTable from "../sql-components/command-builders/ddl/AlterTable";
import {ActivityConstant} from "./ActivityRepository";
import {ColumnType} from "../sql-components/command-builders/ddl/ColumnDefinition";

module BillConstant {
    export const TABLE_NAME: string = 't_bills';
    export const C_BILL_ID: string = 'c_bill_id';
    export const C_BILL_NAME: string = 'c_bill_name';
    export const C_BILL_DATE: string = 'c_bill_date';
    export const C_INSERT_TIME: string = 'c_insert_time';
    export const F_ACTIVITY_ID: string = 'f_activity_id';
}

export class BillRepository extends BaseRepository<Bill> {

    constructor(executor: CommandExecutor) {
        super(executor)
    }

    async createTable(): Promise<void> {
        const createTableCommand = new CreateTable()
            .tableName(BillConstant.TABLE_NAME)
            .column(BillConstant.C_BILL_ID, ColumnType.TEXT)
            .primaryKey()
            .column(BillConstant.C_BILL_NAME, ColumnType.TEXT)
            .notNull()
            .column(BillConstant.C_BILL_DATE, ColumnType.INTEGER)
            .notNull()
            .column(BillConstant.C_INSERT_TIME, ColumnType.INTEGER)
            .notNull();
        await this.executeCommand(createTableCommand)
    }

    async addAllRelations(): Promise<void> {
        const alterTableCommand = new AlterTable()
            .tableName(BillConstant.TABLE_NAME)
            .column("f_activity", ColumnType.INTEGER)
            .foreignKey(ActivityConstant.TABLE_NAME)
        await this.executeCommand(alterTableCommand)

    }

    async insert(bill: Bill): Promise<void> {
        const insertCommand = new InsertInto()
            .tableName(BillConstant.TABLE_NAME)
            .value(BillConstant.C_BILL_ID, bill.billId)
            .value(BillConstant.C_BILL_NAME, bill.billName)
            .value(BillConstant.C_BILL_DATE, bill.billDate.getTime())
            .value(BillConstant.C_INSERT_TIME, bill.insertTime.getTime())
            .value(BillConstant.F_ACTIVITY_ID, bill.activity?.activityId)
        await this.executeCommand(insertCommand)
    }
}
