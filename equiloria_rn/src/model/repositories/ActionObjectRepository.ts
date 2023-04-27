import CommandExecutor from "../sql-components/command-executors/CommandExecutor";
import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {ColumnType} from "../sql-components/command-builders/ColumnType";
import AlterTable from "../sql-components/command-builders/ddl/AlterTable";
import {ActivityConstant} from "../entities/Activity";
import DdlBuilder from "../sql-components/command-builders/ddl/DdlBuilder";
import DropTable from "../sql-components/command-builders/ddl/DropTable";
import {BaseRepository} from "./BaseRepository";
import {ActionObject, ActionObjectConstant} from "../entities/ActionObject";
import DmlBuilder from "../sql-components/command-builders/dml/DmlBuilder";
import {InsertInto} from "../sql-components/command-builders/dml/InsertInto";
import {v4 as generateUuid} from "uuid";
import {BillConstant} from "../entities/Bill";


export default class ActionObjectRepository extends BaseRepository<ActionObject> {
    public static actionObjectRepositoryName: string = 'ActionObjectRepository';

    constructor(executor: CommandExecutor) {
        super(executor);
    }

    public async createTable(): Promise<void> {
        const createTableCommand: CreateTable = new CreateTable()
            .tableName(ActionObjectConstant.TABLE_NAME)
            .column(ActionObjectConstant.C_ACTION_OBJECT_ID, ColumnType.TEXT)
            .primaryKey()
            .column(ActionObjectConstant.C_INSERT_TIME, ColumnType.INTEGER)
            .notNull();
        await this.executeDdlCommand(createTableCommand);
    }

    public async addAllRelations(): Promise<void> {
        await this.addActivityRelation();
        await this.addBillRelation();
    }

    private async addActivityRelation() {
        const alterTableCommand: AlterTable = new AlterTable()
            .tableName(ActionObjectConstant.TABLE_NAME)
            .column(ActionObjectConstant.F_ACTIVITY_ID, ColumnType.TEXT)
            .foreignKey(ActivityConstant.TABLE_NAME);
        await this.executeDdlCommand(alterTableCommand);
    }

    private async addBillRelation() {
        const alterTableCommand: AlterTable = new AlterTable()
            .tableName(ActionObjectConstant.TABLE_NAME)
            .column(ActionObjectConstant.F_BILL_ID, ColumnType.TEXT)
            .foreignKey(BillConstant.TABLE_NAME);
        await this.executeDdlCommand(alterTableCommand);
    }

    public async dropTable(): Promise<void> {
        const dropCommandBuilder: DdlBuilder = new DropTable()
            .tableName(ActionObjectConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }

    public insertByParent(actionObject: ActionObject): DmlBuilder {
        let uuid: string = generateUuid();
        let dmlBuilder = new InsertInto()
            .tableName(ActionObjectConstant.TABLE_NAME)
            .column(ActionObjectConstant.C_ACTION_OBJECT_ID, uuid)
            .column(ActionObjectConstant.C_INSERT_TIME, new Date().getTime());

        if (actionObject.activity != null && actionObject.activity.activityId != null) {
            dmlBuilder.column(ActionObjectConstant.F_ACTIVITY_ID, actionObject.activity.activityId);
        }
        if (actionObject.bill != null && actionObject.bill.billId != null) {
            dmlBuilder.column(ActionObjectConstant.F_BILL_ID, actionObject.bill.billId);
        }

        return dmlBuilder;
    }
}