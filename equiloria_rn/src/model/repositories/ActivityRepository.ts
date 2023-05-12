import {BaseRepository} from "./BaseRepository";
import {Activity, ActivityBuilder, ActivityConstant} from "../entities/Activity";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";
import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {InsertInto} from "../sql-components/command-builders/dml/InsertInto";

import {DqlBuilder} from "../sql-components/command-builders/dql/DqlBuilder";
import {Direction} from "../sql-components/command-builders/OrderBy";
import DeleteTable from "../sql-components/command-builders/dml/DeleteTable";
import DropTable from "../sql-components/command-builders/ddl/DropTable";
import DmlCommandAggregator from "./aggregators/DmlCommandAggregator";
import {ColumnType} from "../sql-components/command-builders/ColumnType";
import UpdateTable from "../sql-components/command-builders/dml/UpdateTable";
import BillRepository from "./BillRepository";
import AlterTable from "../sql-components/command-builders/ddl/AlterTable";
import {ConsumptionTypeConstant} from "../entities/ConsumptionType";
import uuid from "react-native-uuid";


class ActivityRepository extends BaseRepository<Activity> {
    public static activityRepositoryName: string = 'ActivityRepository';
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

    public async addAllRelations(): Promise<void> {
        await this.addConsumptionRelation();
    }

    private async addConsumptionRelation() {
        const alterTableCommand: AlterTable = new AlterTable()
            .tableName(ActivityConstant.TABLE_NAME)
            .column(ActivityConstant.F_CONSUMPTION_TYPE, ColumnType.TEXT)
            .foreignKey(ConsumptionTypeConstant.TABLE_NAME)
        await this.executeDdlCommand(alterTableCommand);
    }

    public async dropTable(): Promise<void> {
        const dropCommandBuilder = new DropTable()
            .tableName(ActivityConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }

    public async persist(activity: Activity): Promise<string> {
        let activityId: string = activity.activityId;
        let updated: Boolean = await this.update(activity);
        if (!updated) {
            activityId = await this.insert(activity);
        }
        return activityId;
    }

    public async insert(activity: Activity): Promise<string> {
        const commandAggregator = new DmlCommandAggregator();
        let uuidValue = uuid.v4();
        const insertCommandBuilder = new InsertInto()
            .tableName(ActivityConstant.TABLE_NAME)
            .column(ActivityConstant.C_ACTIVITY_ID, uuidValue)
            .column(ActivityConstant.C_ACTIVITY_NAME, activity.activityName)
            .column(ActivityConstant.C_TO_DATE, activity.toDate)
            .column(ActivityConstant.C_INSERT_TIME, new Date().getTime());
        commandAggregator.command(insertCommandBuilder);
        for (const bill of activity.bills) {
            bill.activity = activity.activityId;
            commandAggregator.command(this.billRepository.persistByParent(bill));
        }
        await this.executeDmlCommandsWithAggregator(commandAggregator);
        if (typeof uuidValue == "string") {
            return uuidValue;
        }
        return '';
    }

    public async update(activity: Activity): Promise<Boolean> {
        let foundActivity: Activity | null = null;
        if (activity.activityId !== '') {
            try {
                foundActivity = await this.findById(activity.activityId);
            } catch (e) {
                console.error(e);
                console.info('Updating activity was not successful.');
                return false;
            }
        }
        if (foundActivity != null) {
            const commandAggregator = new DmlCommandAggregator();
            const updateCommandBuilder = new UpdateTable()
                .tableName(ActivityConstant.TABLE_NAME)
                .column(ActivityConstant.C_ACTIVITY_NAME, activity.activityName !== foundActivity.activityName ? activity.activityName : foundActivity.activityName);
            if (activity.fromDate != null) {
                updateCommandBuilder
                    .column(ActivityConstant.C_FROM_DATE, activity.fromDate !== foundActivity.fromDate ? activity.fromDate : foundActivity.fromDate);
            }
            if (activity.toDate != null) {
                updateCommandBuilder
                    .column(ActivityConstant.C_TO_DATE, activity.toDate !== foundActivity.toDate ? activity.toDate : foundActivity.toDate);
            }
            updateCommandBuilder
                .where(ActivityConstant.C_ACTIVITY_ID, activity.activityId);
            commandAggregator.command(updateCommandBuilder);
            for (const bill of activity.bills) {
                bill.activity = activity.activityId;
                commandAggregator.command(this.billRepository.persistByParent(bill));
            }
            await this.executeDmlCommandsWithAggregator(commandAggregator);
            console.info('Activity has updated.');
            return true;
        }
        console.info('Activity not found');
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
        console.info('dql...........................')
        const dqlBuilder = new DqlBuilder<Activity>(new ActivityBuilder().build())
            .select('*')
            .from(ActivityConstant.TABLE_NAME)
            .where(ActivityConstant.C_ACTIVITY_ID, activityId);

        let activities: Activity[] = await this.executeDqlCommand(dqlBuilder);
        if (activities.length === 1) {
            activities[0].bills = await this.billRepository.findByActivityId(activities[0].activityId);
        }
        return activities[0];
    }
}

export default ActivityRepository;
