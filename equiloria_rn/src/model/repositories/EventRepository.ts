import {BaseRepository} from "./BaseRepository";
import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {EventConstant, Event} from "../entities/Event";
import {ColumnType} from "../sql-components/command-builders/ColumnType";
import AlterTable from "../sql-components/command-builders/ddl/AlterTable";
import DdlBuilder from "../sql-components/command-builders/ddl/DdlBuilder";
import DropTable from "../sql-components/command-builders/ddl/DropTable";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";
import {UserActionConstant} from "../entities/UserAction";
import DmlCommandAggregator from "./aggregators/DmlCommandAggregator";
import {v4 as generateUuid} from "uuid";
import {InsertInto} from "../sql-components/command-builders/dml/InsertInto";
import UserActionRepository from "./UserActionRepository";

export default class EventRepository extends BaseRepository<Event> {

    public static eventRepositoryName: string = 'EventRepository';
    private userActionRepository: UserActionRepository;

    constructor(executor: CommandExecutor, userActionRepository: UserActionRepository) {
        super(executor);
        this.userActionRepository = userActionRepository;
    }

    public async createTable(): Promise<void> {
        const createTableCommand: CreateTable = new CreateTable()
            .tableName(EventConstant.TABLE_NAME)
            .column(EventConstant.C_EVENT_ID, ColumnType.TEXT)
            .primaryKey()
            .column(EventConstant.C_INSERT_TIME, ColumnType.INTEGER)
            .notNull();
        await this.executeDdlCommand(createTableCommand)
    }

    public async addAllRelations(): Promise<void> {
        const alterTableCommand: AlterTable = new AlterTable()
            .tableName(EventConstant.TABLE_NAME)
            .column(EventConstant.F_USER_ACTION_ID, ColumnType.TEXT)
            .foreignKey(UserActionConstant.TABLE_NAME)
        await this.executeDdlCommand(alterTableCommand)

    }

    public async dropTable(): Promise<void> {
        const dropCommandBuilder: DdlBuilder = new DropTable()
            .tableName(EventConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }

    public async insert(event: Event): Promise<void> {
        const commandAggregator = new DmlCommandAggregator();
        let uuid = generateUuid();
        const insertCommandBuilder = new InsertInto()
            .tableName(EventConstant.TABLE_NAME)
            .column(EventConstant.C_EVENT_ID, uuid)
            .column(EventConstant.C_INSERT_TIME, new Date().getTime())
        commandAggregator.command(insertCommandBuilder);
        if (event.userAction != null) {
            commandAggregator.commands(this.userActionRepository.insertByParent(event.userAction));
        }
        await this.executeDmlCommandsWithAggregator(commandAggregator)
    }

}