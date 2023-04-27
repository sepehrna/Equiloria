import CreateTable from "../sql-components/command-builders/ddl/CreateTable";
import {ColumnType} from "../sql-components/command-builders/ColumnType";
import {Location, LocationConstant} from "../entities/Location";
import DdlBuilder from "../sql-components/command-builders/ddl/DdlBuilder";
import DropTable from "../sql-components/command-builders/ddl/DropTable";
import {BaseRepository} from "./BaseRepository";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";
import {Bill, BillConstant} from "../entities/Bill";
import DmlBuilder from "../sql-components/command-builders/dml/DmlBuilder";
import uuid from "react-native-uuid";
import {InsertInto} from "../sql-components/command-builders/dml/InsertInto";
import {DqlBuilder} from "../sql-components/command-builders/dql/DqlBuilder";

class LocationRepository extends BaseRepository<Location> {
    public static locationRepositoryName: string = 'LocationRepository';

    constructor(executor: CommandExecutor) {
        super(executor);
    }

    public async createTable(): Promise<void> {
        console.info('before table');
        const createTableCommand: CreateTable = new CreateTable()
            .tableName(LocationConstant.TABLE_NAME)
            .column(LocationConstant.C_LOCATION_ID, ColumnType.TEXT)
            .primaryKey()
            .column(LocationConstant.C_INSERT_TIME, ColumnType.INTEGER)
            .notNull()
            .column(LocationConstant.C_LONGITUDE, ColumnType.TEXT)
            .notNull()
            .column(LocationConstant.C_LATITUDE, ColumnType.TEXT);
        console.info('before command')
        await this.executeDdlCommand(createTableCommand);
    }

    public async dropTable(): Promise<void> {
        const dropCommandBuilder: DdlBuilder = new DropTable()
            .tableName(LocationConstant.TABLE_NAME);
        await this.executeDdlCommand(dropCommandBuilder);
    }

    private makeMandatoryFieldsBuilder(location: Location): DmlBuilder {
        let uuidValue = uuid.v4();
        return new InsertInto()
            .tableName(LocationConstant.TABLE_NAME)
            .column(LocationConstant.C_LOCATION_ID, uuidValue)
            .column(LocationConstant.C_INSERT_TIME, new Date().getTime())
            .column(LocationConstant.C_LATITUDE, location.latitude)
            .column(LocationConstant.C_LONGITUDE, location.longitude);
    }

    public async insert(location: Location): Promise<void> {
        let dmlBuilder: DmlBuilder = this
            .makeMandatoryFieldsBuilder(location);
        return await this.executeDmlCommand(dmlBuilder);
    }

    public async findByLatitudeAndLongitude(latitude: number, longitude: number): Promise<Location | null> {
        let dqlBuilder: DqlBuilder<Location> = new DqlBuilder<Location>(new Location())
            .select('*')
            .from(LocationConstant.TABLE_NAME)
            .where(LocationConstant.C_LATITUDE, latitude)
            .where(LocationConstant.C_LONGITUDE, longitude);
        let locations: Location[] = await this.executeDqlCommand<Location>(dqlBuilder);
        return locations.length !== 1 ? locations[0] : null;
    }
}

export default LocationRepository;