import IIoCContainer from "./IIoCContainer";
import ExpoBasedDeviceServices from "../../services/ExpoBasedDeviceServices";
import {ActionServices} from "../../services/ActionServices";
import ActivityRepository from "../../model/repositories/ActivityRepository";
import BillRepository from "../../model/repositories/BillRepository";
import SqliteInMemoryCommandExecutor from "../../model/sql-components/command-executors/SqliteInMemoryCommandExecutor";
import BillValidator from "../../services/BillValidator";
import SqliteRepositoryInitiator from "../../model/repositories/SqliteRepositoryInitiator";
import ActionObjectRepository from "../../model/repositories/ActionObjectRepository";
import ConsumptionTypeRepository from "../../model/repositories/ConsumptionTypeRepository";
import EventRepository from "../../model/repositories/EventRepository";
import LocationRepository from "../../model/repositories/LocationRepository";
import UserActionRepository from "../../model/repositories/UserActionRepository";
import {IDeviceServicesServiceDefinition} from "../../services/IDeviceServices";
import deviceServicesInterfaceName = IDeviceServicesServiceDefinition.DEVICE_SERVICES_NAME;
import {IActionServiceServiceDefinition} from "../../services/IActionServices";
import actionServicesInterfaceName = IActionServiceServiceDefinition.ACTION_SERVICE_NAME;
import CommandExecutor, {CommandExecutorDefinition} from "../../model/sql-components/command-executors/CommandExecutor";
import commandExecutorName = CommandExecutorDefinition.COMMAND_EXECUTOR_NAME;
import {RepositoryInitiatorDefinition} from "../../services/IRepositoryInitiator";
import activityRepository from "../../model/repositories/ActivityRepository";
import REPOSITORY_INITIATOR_NAME = RepositoryInitiatorDefinition.REPOSITORY_INITIATOR_NAME;

export class DefaultIoCContainer implements IIoCContainer {
    private services: Map<string, any>;
    private readonly dbName: string;

    constructor(dbName: string) {
        this.dbName = dbName;
        this.services = new Map();
    }

    public initialize(): void {
        this.initializeRepository();
        this.initializeServices();
    }

    private initializeServices() {
        console.info('Initializing services');
        let expoBasedDeviceServices = new ExpoBasedDeviceServices();
        this.register(deviceServicesInterfaceName, expoBasedDeviceServices);
        let billValidator = new BillValidator();
        this.register(BillValidator.billValidatorName, billValidator);
        let actionServices = new ActionServices(this.resolve(ActivityRepository.activityRepositoryName)
            , this.resolve(BillRepository.billRepositoryName)
            , billValidator);
        this.register(actionServicesInterfaceName
            , actionServices);
    }

    private initializeRepository() {

        console.info('Initializing repository');

        let sqliteInMemoryCommandExecutor: CommandExecutor = new SqliteInMemoryCommandExecutor(this.dbName);
        this.register(commandExecutorName, sqliteInMemoryCommandExecutor);

        let actionObjectRepository: ActionObjectRepository = new ActionObjectRepository(sqliteInMemoryCommandExecutor);
        this.register(ActionObjectRepository.actionObjectRepositoryName, actionObjectRepository);

        let locationRepository: LocationRepository = new LocationRepository(sqliteInMemoryCommandExecutor);
        this.register(LocationRepository.locationRepositoryName, locationRepository);

        let consumptionTypeRepository: ConsumptionTypeRepository = new ConsumptionTypeRepository(sqliteInMemoryCommandExecutor);
        this.register(ConsumptionTypeRepository.consumptionTypeRepository, consumptionTypeRepository);

        let userActionRepository: UserActionRepository = new UserActionRepository(sqliteInMemoryCommandExecutor, actionObjectRepository);
        this.register(UserActionRepository.userActionRepositoryName, userActionRepository);

        let eventRepository: EventRepository = new EventRepository(sqliteInMemoryCommandExecutor, userActionRepository);
        this.register(EventRepository.eventRepositoryName, eventRepository);

        let billRepository: BillRepository = new BillRepository(sqliteInMemoryCommandExecutor, locationRepository);
        this.register(BillRepository.billRepositoryName, billRepository);

        let activityRepository: activityRepository = new ActivityRepository(sqliteInMemoryCommandExecutor, billRepository);
        this.register(ActivityRepository.activityRepositoryName, activityRepository);
        console.info('****************************')

        let sqliteRepositoryInitiator = new SqliteRepositoryInitiator(
            actionObjectRepository
            , consumptionTypeRepository
            , activityRepository
            , billRepository
            , eventRepository
            , locationRepository
            , userActionRepository
            , this.dbName
        );
        this.register(REPOSITORY_INITIATOR_NAME, sqliteRepositoryInitiator);
    }

    register<T>(name: string, instance: T): void {
        this.services.set(name, instance);
    }

    resolve<T>(name: string): T {
        const service = this.services.get(name);

        if (!service) {
            throw new Error(`Service not found: ${name}`);
        }

        return service;
    }
}


