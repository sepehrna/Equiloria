import {BaseRepository} from "./BaseRepository";
import {Bill, BillBuilder, BillConstant} from "../entities/Bill";
import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {InsertInto} from "../sql-components/command-builders/dml/InsertInto";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";
import AlterTable from "../sql-components/command-builders/ddl/AlterTable";
import {v4 as generateUuid} from "uuid";
import DropTable from "../sql-components/command-builders/ddl/DropTable";
import DmlBuilder from "../sql-components/command-builders/dml/DmlBuilder";
import {ActivityConstant} from "../entities/Activity";
import {ColumnType} from "../sql-components/command-builders/ColumnType";
import DdlBuilder from "../sql-components/command-builders/ddl/DdlBuilder";
import {DqlBuilder} from "../sql-components/command-builders/dql/DqlBuilder";
import UpdateTable from "../sql-components/command-builders/dml/UpdateTable";
import {LocationConstant} from "../entities/Location";
import {Direction} from "../sql-components/command-builders/OrderBy";

class BillRepository extends BaseRepository<Bill> {

    public static billRepositoryName: string = 'BillRepository';

    constructor(executor: CommandExecutor) {
        super(executor);
    }

    public async createTable(): Promise<void> {
        const createTableCommand: CreateTable = new CreateTable()
            .tableName(BillConstant.TABLE_NAME)
            .column(BillConstant.C_BILL_ID, ColumnType.TEXT)
            .primaryKey()
            .column(BillConstant.C_BILL_NAME, ColumnType.TEXT)
            .notNull()
            .column(BillConstant.C_BILL_AMOUNT, ColumnType.TEXT)
            .notNull()
            .column(BillConstant.C_BILL_DATE, ColumnType.INTEGER)
            .notNull()
            .column(BillConstant.C_INSERT_TIME, ColumnType.INTEGER)
            .notNull()
            .column(BillConstant.C_DESCRIPTION, ColumnType.INTEGER);
        await this.executeDdlCommand(createTableCommand);
    }

    public async addAllRelations(): Promise<void> {
        const alterTableCommand: AlterTable = new AlterTable()
            .tableName(BillConstant.TABLE_NAME)
            .column(BillConstant.F_ACTIVITY_ID, ColumnType.TEXT)
            .foreignKey(ActivityConstant.TABLE_NAME)
            .column(BillConstant.F_LOCATION_ID, ColumnType.TEXT)
            .foreignKey(LocationConstant.TABLE_NAME);
        await this.executeDdlCommand(alterTableCommand);
    }

    public async dropTable(): Promise<void> {
        const dropCommandBuilder: DdlBuilder = new DropTable()
            .tableName(BillConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }

    private makeMandatoryFieldsBuilder(bill: Bill): DmlBuilder {
        let uuid: string = generateUuid();
        return new InsertInto()
            .tableName(BillConstant.TABLE_NAME)
            .column(BillConstant.C_BILL_ID, uuid)
            .column(BillConstant.C_BILL_NAME, bill.billName)
            .column(BillConstant.C_BILL_DATE, bill.billDate.getTime())
            .column(BillConstant.C_INSERT_TIME, new Date().getTime());
    }

    public persistByParent(bill: Bill): DmlBuilder {
        let dmlBuilder: DmlBuilder | null = this.updateByParent(bill);
        return dmlBuilder ? dmlBuilder : this.insertByParent(bill);
    }

    public insertByParent(bill: Bill): DmlBuilder {
        return this
            .makeMandatoryFieldsBuilder(bill)
            .column(BillConstant.F_ACTIVITY_ID, bill.activity?.activityId);
    }

    public updateByParent(bill: Bill): DmlBuilder | null {
        if (bill.billId !== '') {
            let foundBill;
            try {
                foundBill = (async () => {
                    return await this.findById(bill.billId);
                })();
            } catch (e) {
                console.error(e);
                return null;
            }
            if (foundBill != null) {
                return new UpdateTable().tableName(BillConstant.TABLE_NAME)
                    .column(BillConstant.F_ACTIVITY_ID, bill.activity?.activityId)
                    .where(BillConstant.C_BILL_ID, bill.billId);
            }
        }
        return null;
    }

    public async insert(bill: Bill): Promise<void> {
        let dmlBuilder: DmlBuilder = this
            .makeMandatoryFieldsBuilder(bill)
            .column(BillConstant.F_ACTIVITY_ID, bill.activity?.activityId);
        return await this.executeDmlCommand(dmlBuilder);
    }

    public async findAll(): Promise<Bill[]> {
        let commandBuilder: DqlBuilder<Bill> =
            new DqlBuilder(new BillBuilder().build())
                .select('*')
                .from(BillConstant.TABLE_NAME)
                .orderBy(BillConstant.C_INSERT_TIME, Direction.DESC);
        return await this.executeDqlCommand(commandBuilder);
    }

    public async findByIds(ids: string[]): Promise<Bill[]> {

        let commandBuilder: DqlBuilder<Bill> =
            new DqlBuilder(new BillBuilder().build())
                .select('*')
                .from(BillConstant.TABLE_NAME);

        ids.forEach(id => {
            commandBuilder.where(BillConstant.C_BILL_ID, id);
        });

        return await this.executeDqlCommand(commandBuilder);
    }

    public async findById(id: string): Promise<Bill | null> {

        let commandBuilder: DqlBuilder<Bill> =
            new DqlBuilder(new BillBuilder().build())
                .select('*')
                .from(BillConstant.TABLE_NAME)
                .where(BillConstant.C_BILL_ID, id);

        let bills: Bill[] = await this.executeDqlCommand(commandBuilder);

        return bills.length === 1 ? bills[0] : null;
    }

    public async findByActivityId(activityId: string): Promise<Bill[]> {
        let commandBuilder: DqlBuilder<Bill> =
            new DqlBuilder(new BillBuilder().build())
                .select('*')
                .from(BillConstant.TABLE_NAME)
                .where(BillConstant.F_ACTIVITY_ID, activityId);

        return await this.executeDqlCommand(commandBuilder);
    }
}

export default BillRepository;