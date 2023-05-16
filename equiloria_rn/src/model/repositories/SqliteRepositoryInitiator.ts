import ActionObjectRepository from "./ActionObjectRepository";
import ActivityRepository from "./ActivityRepository";
import BillRepository from "./BillRepository";
import EventRepository from "./EventRepository";
import LocationRepository from "./LocationRepository";
import UserActionRepository from "./UserActionRepository";
import * as FileSystem from 'expo-file-system';
import ConsumptionTypeRepository from "./ConsumptionTypeRepository";
import IRepositoryInitiator from "../../services/IRepositoryInitiator";
import locationRepository from "./LocationRepository";
import billRepository from "./BillRepository";
import ParticipantRepository from "./ParticipantRepository";
import ActivityParticipantRepository from "./ActivityParticipantRepository";

class SqliteRepositoryInitiator implements IRepositoryInitiator {
    private actionObjectRepository: ActionObjectRepository;
    private consumptionTypeRepository: ConsumptionTypeRepository;
    private activityRepository: ActivityRepository;
    private billRepository: BillRepository;
    private eventRepository: EventRepository;
    private locationRepository: LocationRepository;
    private userActionRepository: UserActionRepository;
    private participantRepository: ParticipantRepository;
    private activityParticipantRepository: ActivityParticipantRepository;
    private readonly databaseName: string;


    constructor(actionObjectRepository: ActionObjectRepository, consumptionTypeRepository: ConsumptionTypeRepository, activityRepository: ActivityRepository, billRepository: BillRepository, eventRepository: EventRepository, locationRepository: LocationRepository, userActionRepository: UserActionRepository, participantRepository: ParticipantRepository, activityParticipantRepository: ActivityParticipantRepository, databaseName: string) {
        this.actionObjectRepository = actionObjectRepository;
        this.consumptionTypeRepository = consumptionTypeRepository;
        this.activityRepository = activityRepository;
        this.billRepository = billRepository;
        this.eventRepository = eventRepository;
        this.locationRepository = locationRepository;
        this.userActionRepository = userActionRepository;
        this.participantRepository = participantRepository;
        this.activityParticipantRepository = activityParticipantRepository;
        this.databaseName = databaseName;
    }

    private async checkDatabaseExists(): Promise<boolean> {
        try {
            const dbPath = `${FileSystem.documentDirectory}SQLite/${this.databaseName}`;
            const dbInfo = await FileSystem.getInfoAsync(dbPath);
            return dbInfo.exists;
        } catch (error) {
            console.error('Error checking database existence:', error);
            return false;
        }
    }

    async initializeDatabase(): Promise<Boolean> {
        let isDbExists = await this.checkDatabaseExists();
        console.info(isDbExists);
        if (!isDbExists) {
            await this.initDbObjects();
            return true;
        }
        return false;
    }

    async initDbObjects() {
        await this.consumptionTypeRepository.createTable();
        await this.participantRepository.createTable();
        await this.locationRepository.createTable();
        await this.billRepository.createTable();
        await this.activityRepository.createTable();
        await this.actionObjectRepository.createTable();
        await this.userActionRepository.createTable();
        await this.eventRepository.createTable();
        await this.activityParticipantRepository.createTable();

        await this.billRepository.addAllRelations();
        await this.activityRepository.addAllRelations();
        await this.actionObjectRepository.addAllRelations();
        await this.userActionRepository.addAllRelations();
        await this.eventRepository.addAllRelations();
        await this.activityParticipantRepository.addAllRelations();

    }

    async wipeDatabase() {
        await this.consumptionTypeRepository.dropTable();
        await this.participantRepository.dropTable();
        await this.locationRepository.dropTable();
        await this.billRepository.dropTable();
        await this.activityRepository.dropTable();
        await this.actionObjectRepository.dropTable();
        await this.userActionRepository.dropTable();
        await this.eventRepository.dropTable();
        await this.activityParticipantRepository.dropTable();
    }
}

export default SqliteRepositoryInitiator;