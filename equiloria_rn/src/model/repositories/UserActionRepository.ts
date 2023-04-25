import {BaseRepository} from "./BaseRepository";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";
import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {ColumnType} from "../sql-components/command-builders/ColumnType";
import AlterTable from "../sql-components/command-builders/ddl/AlterTable";
import DdlBuilder from "../sql-components/command-builders/ddl/DdlBuilder";
import DropTable from "../sql-components/command-builders/ddl/DropTable";
import {v4 as generateUuid} from "uuid";
import {InsertInto} from "../sql-components/command-builders/dml/InsertInto";
import {UserAction, UserActionConstant} from "../entities/UserAction";
import {ActionObjectConstant} from "../entities/ActionObject";
import ActionObjectRepository from "./ActionObjectRepository";
import DmlCommandAggregator from "./aggregators/DmlCommandAggregator";

export default class UserActionRepository extends BaseRepository<UserAction> {

    actionObjectRepository: ActionObjectRepository;
    public static userActionRepositoryName: string = 'UserActionRepository';

    constructor(executor: CommandExecutor, actionObjectRepository: ActionObjectRepository) {
        super(executor);
        this.actionObjectRepository = actionObjectRepository;
    }

    public async createTable(): Promise<void> {
        const createTableCommand: CreateTable = new CreateTable()
            .tableName(UserActionConstant.TABLE_NAME)
            .column(UserActionConstant.C_USER_ACTION_ID, ColumnType.TEXT)
            .primaryKey()
            .column(UserActionConstant.C_INSERT_TIME, ColumnType.INTEGER)
            .notNull();
        await this.executeDdlCommand(createTableCommand)
    }

    public async addAllRelations(): Promise<void> {
        const alterTableCommand: AlterTable = new AlterTable()
            .tableName(UserActionConstant.TABLE_NAME)
            .column(UserActionConstant.F_ACTION_OBJECT_ID, ColumnType.TEXT)
            .foreignKey(ActionObjectConstant.TABLE_NAME);
        await this.executeDdlCommand(alterTableCommand);

    }

    public async dropTable(): Promise<void> {
        const dropCommandBuilder: DdlBuilder = new DropTable()
            .tableName(UserActionConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }

    public insertByParent(userAction: UserAction): DmlCommandAggregator {
        const commandAggregator = new DmlCommandAggregator();
        let uuid: string = generateUuid();
        let insertCommandBuilder = new InsertInto()
            .tableName(UserActionConstant.TABLE_NAME)
            .column(UserActionConstant.C_USER_ACTION_ID, uuid)
            .column(UserActionConstant.C_INSERT_TIME, new Date().getTime());
        commandAggregator.command(insertCommandBuilder);
        commandAggregator.command(this.actionObjectRepository.insertByParent(userAction.actionObject));
        return commandAggregator;
    }
}