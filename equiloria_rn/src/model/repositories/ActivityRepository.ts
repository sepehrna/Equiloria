import {BaseRepository} from "./BaseRepository";
import {Activity, ActivityBuilder, ActivityConstant} from "../entities/Activity";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";
import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {InsertInto} from "../sql-components/command-builders/dml/InsertInto";
import {BillRepository} from "./BillRepository";
import {DqlBuilder} from "../sql-components/command-builders/dql/DqlBuilder";
import {Direction} from "../sql-components/command-builders/OrderBy";
import DeleteTable from "../sql-components/command-builders/dml/DeleteTable";
import {v4 as generateUuid} from "uuid";
import DropTable from "../sql-components/command-builders/ddl/DropTable";
import DmlCommandAggregator from "./aggregators/DmlCommandAggregator";
import {ColumnType} from "../sql-components/command-builders/ColumnType";

export class ActivityRepository extends BaseRepository<Activity> {

    private billRepository: BillRepository;

    constructor(executor: CommandExecutor, billRepository: BillRepository) {
        super(executor);
        this.billRepository = billRepository;
    }

    public async createTable(): Promise<void> {
        const createTableCommand = new CreateTable()
            .tableName(ActivityConstant.TABLE_NAME)
            .column(ActivityConstant.C_ACTIVITY_ID, ColumnType.TEXT)
            .primaryKey()
            .column(ActivityConstant.C_ACTIVITY_NAME, ColumnType.TEXT)
            .notNull()
            .column(ActivityConstant.C_ACTIVITY_DATE, ColumnType.INTEGER)
            .notNull()
            .column(ActivityConstant.C_INSERT_TIME, ColumnType.INTEGER)
            .notNull();
        await this.executeDdlCommand(createTableCommand);
    }

    public async dropTable(): Promise<void> {
        const dropCommandBuilder = new DropTable()
            .tableName(ActivityConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }

    public async insert(activity: Activity): Promise<void> {
        const commandAggregator = new DmlCommandAggregator();
        let uuid = generateUuid();
        const insertCommandBuilder = new InsertInto()
            .tableName(ActivityConstant.TABLE_NAME)
            .column(ActivityConstant.C_ACTIVITY_ID, uuid)
            .column(ActivityConstant.C_ACTIVITY_NAME, activity.activityName)
            .column(ActivityConstant.C_ACTIVITY_DATE, activity.activityDate)
            .column(ActivityConstant.C_INSERT_TIME, new Date().getTime())
        commandAggregator.command(insertCommandBuilder);
        for (const bill of activity.bills) {
            bill.activity = activity;
            commandAggregator.command(this.billRepository.insertByParent(bill));
        }
        await this.executeDmlCommandsWithAggregator(commandAggregator)
    }

    public async delete(activityId: string): Promise<void> {
        const dmlBuilder = new DeleteTable()
            .tableName(ActivityConstant.TABLE_NAME)
            .where(ActivityConstant.C_ACTIVITY_ID, activityId);

        await this.executeDmlCommand(dmlBuilder);
    }

    public async findAll(): Promise<Activity[]> {
        const dqlBuilder = new DqlBuilder<Activity>(new ActivityBuilder().build())
            .select('*')
            .from(ActivityConstant.TABLE_NAME)
            .orderBy(ActivityConstant.C_INSERT_TIME, Direction.ASC);

        return await this.executeDqlCommand(dqlBuilder);
    }

    public async findById(activityId: string): Promise<Activity | null> {
        const dqlBuilder = new DqlBuilder<Activity>(new ActivityBuilder().build())
            .select('*')
            .from(ActivityConstant.TABLE_NAME)
            .where(ActivityConstant.C_ACTIVITY_ID, `'${activityId}'`);

        let activities = await this.executeDqlCommand(dqlBuilder);
        return activities.length > 0 ? activities[0] : null;
    }

}
