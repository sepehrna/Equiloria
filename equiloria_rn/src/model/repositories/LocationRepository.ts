import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {ColumnType} from "../sql-components/command-builders/ColumnType";
import Location, {LocationConstant} from "../entities/Location";
import DdlBuilder from "../sql-components/command-builders/ddl/DdlBuilder";
import DropTable from "../sql-components/command-builders/ddl/DropTable";
import {BaseRepository} from "./BaseRepository";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";

class LocationRepository extends BaseRepository<Location> {
    public static locationRepositoryName: string = 'LocationRepository';

    constructor(executor: CommandExecutor) {
        super(executor);
    }

    public async createTable(): Promise<void> {
        const createTableCommand: CreateTable = new CreateTable()
            .tableName(LocationConstant.TABLE_NAME)
            .column(LocationConstant.C_LOCATION_ID, ColumnType.TEXT)
            .primaryKey()
            .column(LocationConstant.C_INSERT_TIME, ColumnType.INTEGER)
            .notNull()
            .column(LocationConstant.C_LONGITUDE, ColumnType.TEXT)
            .notNull()
            .column(LocationConstant.C_LATITUDE, ColumnType.TEXT);
        await this.executeDdlCommand(createTableCommand);
    }

    public async dropTable(): Promise<void> {
        const dropCommandBuilder: DdlBuilder = new DropTable()
            .tableName(LocationConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }
}

export default LocationRepository;