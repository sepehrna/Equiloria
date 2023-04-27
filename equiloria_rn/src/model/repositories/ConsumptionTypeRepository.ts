import {BaseRepository} from "./BaseRepository";
import ConsumptionType, {ConsumptionTypeConstant} from "../entities/ConsumptionType";
import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {ColumnType} from "../sql-components/command-builders/ColumnType";
import DdlBuilder from "../sql-components/command-builders/ddl/DdlBuilder";
import DropTable from "../sql-components/command-builders/ddl/DropTable";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";

class ConsumptionTypeRepository extends BaseRepository<ConsumptionType> {
    public static consumptionTypeRepository: string = 'ConsumptionTypeRepository';

    constructor(executor: CommandExecutor) {
        super(executor);
    }

    public async createTable(): Promise<void> {
        const createTableCommand: CreateTable = new CreateTable()
            .tableName(ConsumptionTypeConstant.TABLE_NAME)
            .column(ConsumptionTypeConstant.C_CONSUMPTION_TYPE_ID, ColumnType.TEXT)
            .primaryKey()
            .column(ConsumptionTypeConstant.C_CONSUMPTION_TYPE_NAME, ColumnType.TEXT)
            .notNull()
            .column(ConsumptionTypeConstant.C_INSERT_TIME, ColumnType.INTEGER)
            .notNull();
        await this.executeDdlCommand(createTableCommand);
    }

    public async dropTable(): Promise<void> {
        const dropCommandBuilder: DdlBuilder = new DropTable()
            .tableName(ConsumptionTypeConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }

}

export default ConsumptionTypeRepository;