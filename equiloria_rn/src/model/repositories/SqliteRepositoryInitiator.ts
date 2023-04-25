import ActionObjectRepository from "./ActionObjectRepository";
import ActivityRepository from "./ActivityRepository";
import BillRepository from "./BillRepository";
import EventRepository from "./EventRepository";
import LocationRepository from "./LocationRepository";
import UserActionRepository from "./UserActionRepository";
import * as SQLite from "expo-sqlite";
import {Database} from "expo-sqlite/src/SQLite.types";
import ConsumptionTypeRepository from "./ConsumptionTypeRepository";
import IRepositoryInitiator from "../../services/IRepositoryInitiator";

class SqliteRepositoryInitiator implements IRepositoryInitiator {
    private actionObjectRepository: ActionObjectRepository;
    private consumptionTypeRepository: ConsumptionTypeRepository;
    private activityRepository: ActivityRepository;
    private billRepository: BillRepository;
    private eventRepository: EventRepository;
    private locationRepository: LocationRepository;
    private userActionRepository: UserActionRepository;
    private readonly databaseName: string;


    constructor(actionObjectRepository: ActionObjectRepository, consumptionTypeRepository: ConsumptionTypeRepository, activityRepository: ActivityRepository, billRepository: BillRepository, eventRepository: EventRepository, locationRepository: LocationRepository, userActionRepository: UserActionRepository, databaseName: string) {
        this.actionObjectRepository = actionObjectRepository;
        this.consumptionTypeRepository = consumptionTypeRepository;
        this.activityRepository = activityRepository;
        this.billRepository = billRepository;
        this.eventRepository = eventRepository;
        this.locationRepository = locationRepository;
        this.userActionRepository = userActionRepository;
        this.databaseName = databaseName;
    }

    async initializeDatabase(): Promise<Boolean> {
        let database: Database = SQLite.openDatabase(this.databaseName);
        if (!database) {
            await this.consumptionTypeRepository.createTable();
            await this.locationRepository.createTable();
            await this.billRepository.createTable();
            await this.activityRepository.createTable();
            await this.actionObjectRepository.createTable();
            await this.userActionRepository.createTable();
            await this.eventRepository.createTable();

            await this.billRepository.addAllRelations();
            await this.activityRepository.addAllRelations();
            await this.actionObjectRepository.addAllRelations();
            await this.userActionRepository.addAllRelations();
            await this.eventRepository.addAllRelations();
            return true;
        }
        return false;
    }
}

export default SqliteRepositoryInitiator;