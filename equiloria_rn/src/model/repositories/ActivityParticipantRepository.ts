import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {ColumnType} from "../sql-components/command-builders/ColumnType";
import DdlBuilder from "../sql-components/command-builders/ddl/DdlBuilder";
import DropTable from "../sql-components/command-builders/ddl/DropTable";
import {BaseRepository} from "./BaseRepository";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";
import DmlBuilder from "../sql-components/command-builders/dml/DmlBuilder";
import uuid from "react-native-uuid";
import {InsertInto} from "../sql-components/command-builders/dml/InsertInto";
import {DqlBuilder} from "../sql-components/command-builders/dql/DqlBuilder";
import {ActivityParticipant, ActivityParticipantConstant} from "../entities/ActivityParticipants";
import AlterTable from "../sql-components/command-builders/ddl/AlterTable";
import {ActivityConstant} from "../entities/Activity";
import {ParticipantConstant} from "../entities/Participant";
import UpdateTable from "../sql-components/command-builders/dml/UpdateTable";

class ActivityParticipantRepository extends BaseRepository<ActivityParticipant> {
    public static activityParticipantRepositoryName: string = 'ActivityParticipantRepository';

    constructor(executor: CommandExecutor) {
        super(executor);
    }

    public async createTable(): Promise<void> {
        console.info('before table');
        const createTableCommand: CreateTable = new CreateTable()
            .tableName(ActivityParticipantConstant.TABLE_NAME)
            .column(ActivityParticipantConstant.C_ACTIVITY_PARTICIPANT_ID, ColumnType.TEXT)
            .primaryKey()
            .column(ActivityParticipantConstant.C_SPENT_AMOUNT, ColumnType.TEXT)
            .notNull()
            .column(ActivityParticipantConstant.C_INSERT_TIME, ColumnType.INTEGER)
            .notNull();
        console.info('before command')
        await this.executeDdlCommand(createTableCommand);
    }

    public async addAllRelations(): Promise<void> {
        await this.addParticipantRelation();
        await this.addActivityRelation();
    }

    private async addParticipantRelation() {
        const alterTableCommand: AlterTable = new AlterTable()
            .tableName(ActivityParticipantConstant.TABLE_NAME)
            .column(ActivityParticipantConstant.F_PARTICIPANT_ID, ColumnType.TEXT)
            .foreignKey(ParticipantConstant.TABLE_NAME);
        await this.executeDdlCommand(alterTableCommand);
    }

    public async addActivityRelation() {
        const alterTableCommand: AlterTable = new AlterTable()
            .tableName(ActivityParticipantConstant.TABLE_NAME)
            .column(ActivityParticipantConstant.F_ACTIVITY_ID, ColumnType.TEXT)
            .foreignKey(ActivityConstant.TABLE_NAME);

        await this.executeDdlCommand(alterTableCommand);
    }

    public async dropTable(): Promise<void> {
        const dropCommandBuilder: DdlBuilder = new DropTable()
            .tableName(ActivityParticipantConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }

    private makeMandatoryFieldsBuilder(activityParticipant: ActivityParticipant): DmlBuilder {
        let uuidValue = uuid.v4();
        return new InsertInto()
            .tableName(ActivityParticipantConstant.TABLE_NAME)
            .column(ActivityParticipantConstant.C_ACTIVITY_PARTICIPANT_ID, uuidValue)
            .column(ActivityParticipantConstant.C_INSERT_TIME, new Date().getTime())
            .column(ActivityParticipantConstant.C_SPENT_AMOUNT, activityParticipant.spentAmount);
    }

    async persist(activityParticipant: ActivityParticipant): Promise<void> {
        let foundActivityParticipant: ActivityParticipant[] | null = await this.findByParticipantIdAndActivityId(activityParticipant.participantId, activityParticipant.activityId);
        if (foundActivityParticipant == null || foundActivityParticipant.length === 0) {
            await this.insert(activityParticipant);
        } else {
            await this.update(activityParticipant);
        }
    }

    public async insert(activityParticipant: ActivityParticipant): Promise<void> {
        let dmlBuilder: DmlBuilder = this
            .makeMandatoryFieldsBuilder(activityParticipant)
            .column(ActivityParticipantConstant.F_PARTICIPANT_ID, activityParticipant.participantId)
            .column(ActivityParticipantConstant.F_ACTIVITY_ID, activityParticipant.activityId)
        return await this.executeDmlCommand(dmlBuilder);
    }

    async update(activityParticipant: ActivityParticipant): Promise<void> {
        let updateActivityParticipantTable: DmlBuilder = new UpdateTable()
            .tableName(ActivityParticipantConstant.TABLE_NAME)
            .column(ActivityParticipantConstant.C_SPENT_AMOUNT, activityParticipant.spentAmount);
        return await this.executeDmlCommand(updateActivityParticipantTable);
    }

    public async findById(activityParticipantId: string): Promise<ActivityParticipant | null> {
        let dqlBuilder: DqlBuilder<ActivityParticipant> = new DqlBuilder<ActivityParticipant>(new ActivityParticipant())
            .select('*')
            .from(ActivityParticipantConstant.TABLE_NAME)
            .where(ActivityParticipantConstant.C_ACTIVITY_PARTICIPANT_ID, activityParticipantId)
        let participants: ActivityParticipant[] = await this.executeDqlCommand<ActivityParticipant>(dqlBuilder);
        return participants.length !== 1 ? participants[0] : null;
    }

    public async findByActivityId(activityId: string): Promise<ActivityParticipant[]> {
        let dqlBuilder: DqlBuilder<ActivityParticipant> = new DqlBuilder<ActivityParticipant>(new ActivityParticipant())
            .select('*')
            .from(ActivityParticipantConstant.TABLE_NAME)
            .where(ActivityParticipantConstant.F_ACTIVITY_ID, activityId);
        return await this.executeDqlCommand<ActivityParticipant>(dqlBuilder);
    }

    public async findByParticipantIdAndActivityId(participantId: string, activityId: string): Promise<ActivityParticipant[] | null> {
        let dqlBuilder: DqlBuilder<ActivityParticipant> = new DqlBuilder<ActivityParticipant>(new ActivityParticipant())
            .select('*')
            .from(ActivityParticipantConstant.TABLE_NAME)
            .where(ActivityParticipantConstant.F_PARTICIPANT_ID, participantId)
            .where(ActivityParticipantConstant.F_ACTIVITY_ID, activityId);
        return await this.executeDqlCommand<ActivityParticipant>(dqlBuilder);
    }


}

export default ActivityParticipantRepository;