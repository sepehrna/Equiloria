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
import {Participant, ParticipantBuilder, ParticipantConstant} from "../entities/Participant";
import {ActivityParticipantConstant} from "../entities/ActivityParticipants";

class ParticipantRepository extends BaseRepository<Participant> {
    public static participantRepositoryName: string = 'ParticipantRepository';

    constructor(executor: CommandExecutor) {
        super(executor);
    }

    public async createTable(): Promise<void> {
        console.info('before table');
        const createTableCommand: CreateTable = new CreateTable()
            .tableName(ParticipantConstant.TABLE_NAME)
            .column(ParticipantConstant.C_PARTICIPANT_ID, ColumnType.TEXT)
            .primaryKey()
            .column(ParticipantConstant.C_INSERT_TIME, ColumnType.INTEGER)
            .notNull()
            .column(ParticipantConstant.C_NAME, ColumnType.TEXT)
            .notNull();
        console.info('before command')
        await this.executeDdlCommand(createTableCommand);
    }

    public async dropTable(): Promise<void> {
        const dropCommandBuilder: DdlBuilder = new DropTable()
            .tableName(ParticipantConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }

    public async insert(participant: Participant): Promise<string | number[]> {
        let uuidValue: string | number[] = uuid.v4();
        let dmlBuilder: DmlBuilder = new InsertInto()
            .tableName(ParticipantConstant.TABLE_NAME)
            .column(ParticipantConstant.C_PARTICIPANT_ID, uuidValue)
            .column(ParticipantConstant.C_INSERT_TIME, new Date().getTime())
            .column(ParticipantConstant.C_NAME, participant.participantName);

        await this.executeDmlCommand(dmlBuilder);
        return uuidValue;
    }

    public async findById(participantId: string): Promise<Participant | null> {
        let dqlBuilder: DqlBuilder<Participant> = new DqlBuilder<Participant>(new Participant())
            .select('*')
            .from(ParticipantConstant.TABLE_NAME)
            .where(ParticipantConstant.C_PARTICIPANT_ID, participantId)
        let participants: Participant[] = await this.executeDqlCommand<Participant>(dqlBuilder);
        return participants.length === 1 ? participants[0] : null;
    }

    async findNotRelatedParticipants(activityId: string) {
        let customQuery: string = `SELECT * FROM `
            + ParticipantConstant.TABLE_NAME
            + ' JOIN '
            + ActivityParticipantConstant.TABLE_NAME
            + ' ON '
            + ParticipantConstant.TABLE_NAME
            + '.'
            + ParticipantConstant.C_PARTICIPANT_ID
            + ' = '
            + ActivityParticipantConstant.TABLE_NAME
            + '.'
            + ActivityParticipantConstant.F_PARTICIPANT_ID
            + ' WHERE '
            + ActivityParticipantConstant.TABLE_NAME
            + '.'
            + ActivityParticipantConstant.F_ACTIVITY_ID
            + ' NOT IN '
            + '(' + `'${activityId}'` + ')';
        let participantInstance = new ParticipantBuilder().build();
        return await this.executeCustomDqlCommand<Participant>(customQuery, participantInstance);
    }
}

export default ParticipantRepository;