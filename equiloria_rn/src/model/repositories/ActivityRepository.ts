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
import UpdateTable from "../sql-components/command-builders/dml/UpdateTable";

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
            .column(ActivityConstant.C_INSERT_TIME, ColumnType.INTEGER)
            .notNull()
            .column(ActivityConstant.C_ACTIVITY_NAME, ColumnType.TEXT)
            .notNull()
            .column(ActivityConstant.C_FROM_DATE, ColumnType.INTEGER)
            .column(ActivityConstant.C_TO_DATE, ColumnType.INTEGER);

        await this.executeDdlCommand(createTableCommand);
    }

    public async dropTable(): Promise<void> {
        const dropCommandBuilder = new DropTable()
            .tableName(ActivityConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }

    public async persist(activity: Activity): Promise<void> {
        let updated: Boolean = await this.update(activity);
        if (!updated) {
            await this.insert(activity);
        }
    }

    public async insert(activity: Activity): Promise<void> {
        const commandAggregator = new DmlCommandAggregator();
        let uuid = generateUuid();
        const insertCommandBuilder = new InsertInto()
            .tableName(ActivityConstant.TABLE_NAME)
            .column(ActivityConstant.C_ACTIVITY_ID, uuid)
            .column(ActivityConstant.C_ACTIVITY_NAME, activity.activityName)
            .column(ActivityConstant.C_TO_DATE, activity.toDate)
            .column(ActivityConstant.C_INSERT_TIME, new Date().getTime());
        commandAggregator.command(insertCommandBuilder);
        for (const bill of activity.bills) {
            bill.activity = activity;
            commandAggregator.command(this.billRepository.persistByParent(bill));
        }
        await this.executeDmlCommandsWithAggregator(commandAggregator);
    }

    public async update(activity: Activity): Promise<Boolean> {
        let foundActivity: Activity | null = null;
        if (activity.activityId !== '') {
            try {
                foundActivity = await this.findById(activity.activityId);
            } catch (e) {
                console.error(e);
                return false;
            }
        }
        if (foundActivity != null) {
            const commandAggregator = new DmlCommandAggregator();
            const updateCommandBuilder = new UpdateTable()
                .tableName(ActivityConstant.TABLE_NAME)
                .column(ActivityConstant.C_ACTIVITY_NAME, activity.activityName !== foundActivity.activityName ? activity.activityName : foundActivity.activityName)
                .column(ActivityConstant.C_TO_DATE, activity.toDate !== foundActivity.toDate ? activity.toDate : foundActivity.toDate)
                .where(ActivityConstant.C_ACTIVITY_ID, activity.activityId);
            commandAggregator.command(updateCommandBuilder);
            for (const bill of activity.bills) {
                bill.activity = activity;
                commandAggregator.command(this.billRepository.persistByParent(bill));
            }
            await this.executeDmlCommandsWithAggregator(commandAggregator);
            return true;
        }
        return false;
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

        let activities: Activity[] = await this.executeDqlCommand(dqlBuilder);
        for (const activity of activities) {
            activity.bills = await this.billRepository.findByActivityId(activity.activityId);
        }
        return activities;
    }

    public async findById(activityId: string): Promise<Activity | null> {
        const dqlBuilder = new DqlBuilder<Activity>(new ActivityBuilder().build())
            .select('*')
            .from(ActivityConstant.TABLE_NAME)
            .where(ActivityConstant.C_ACTIVITY_ID, activityId);

        let activities: Activity[] = await this.executeDqlCommand(dqlBuilder);
        let result: Activity | null = null;
        if (activities.length === 1) {
            result = activities[0];
            result.bills = await this.billRepository.findByActivityId(result.activityId);
        }
        return result;
    }

}
