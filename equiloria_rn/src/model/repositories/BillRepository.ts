import {BaseRepository} from "./BaseRepository";
import {Bill, BillConstant} from "../entities/Bill";
import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {InsertInto} from "../sql-components/command-builders/dml/InsertInto";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";
import AlterTable from "../sql-components/command-builders/ddl/AlterTable";
import {v4 as generateUuid} from "uuid";
import DropTable from "../sql-components/command-builders/ddl/DropTable";
import DmlBuilder from "../sql-components/command-builders/dml/DmlBuilder";
import {ActivityConstant} from "../entities/Activity";
import {ColumnType} from "../sql-components/command-builders/ColumnType";

export class BillRepository extends BaseRepository<Bill> {

    constructor(executor: CommandExecutor) {
        super(executor)
    }

    public async createTable(): Promise<void> {
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
        await this.executeDdlCommand(createTableCommand)
    }

    public async addAllRelations(): Promise<void> {
        const alterTableCommand = new AlterTable()
            .tableName(BillConstant.TABLE_NAME)
            .column(BillConstant.F_ACTIVITY_ID, ColumnType.TEXT)
            .foreignKey(ActivityConstant.TABLE_NAME)
        await this.executeDdlCommand(alterTableCommand)

    }
    public async dropTable(): Promise<void> {
        const dropCommandBuilder = new DropTable()
            .tableName(BillConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }
    public insertByParent(bill: Bill): DmlBuilder {
        let uuid = generateUuid();
        return new InsertInto()
            .tableName(BillConstant.TABLE_NAME)
            .column(BillConstant.C_BILL_ID, uuid)
            .column(BillConstant.C_BILL_NAME, bill.billName)
            .column(BillConstant.C_BILL_DATE, bill.billDate.getTime())
            .column(BillConstant.C_INSERT_TIME, new Date().getTime())
            .column(BillConstant.F_ACTIVITY_ID, bill.activity?.activityId);
    }
}
