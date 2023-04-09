import {BaseRepository} from "./BaseRepository";
import {Activity} from "../entities/Activity";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";
import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {InsertInto} from "../sql-components/command-builders/dml/InsertInto";
import {BillRepository} from "./BillRepository";


export module ActivityConstant {
    export const TABLE_NAME: string = 't_activities';
    export const C_ACTIVITY_ID: string = 'c_activity_id';
    export const C_ACTIVITY_NAME: string = 'c_activity_name';
    export const C_ACTIVITY_DATE: string = 'c_activity_date';
    export const C_INSERT_TIME: string = 'c_insert_time';
}

export class ActivityRepository extends BaseRepository<Activity> {

    private billRepository: BillRepository;


    constructor(executor: CommandExecutor, billRepository: BillRepository) {
        super(executor);
        this.billRepository = billRepository;
    }

    async createTable(): Promise<void> {
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
        await this.executeCommand(createTableCommand)
    }

    async insert(activity: Activity): Promise<void> {
        const insertCommand = new InsertInto()
            .tableName(ActivityConstant.TABLE_NAME)
            .value(ActivityConstant.C_ACTIVITY_ID, activity.activityId)
            .value(ActivityConstant.C_ACTIVITY_NAME, activity.activityName)
            .value(ActivityConstant.C_ACTIVITY_DATE, activity.activityDate.getTime())
            .value(ActivityConstant.C_INSERT_TIME, activity.insertTime.getTime())
        for (const bill of activity.bills) {
            bill.activity = activity
            await this.billRepository.insert(bill);
        }
        await this.executeCommand(insertCommand)
    }
}
