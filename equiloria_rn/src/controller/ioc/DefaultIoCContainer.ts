import IIoCContainer from "./IIoCContainer";
import ExpoBasedDeviceServices from "../../services/ExpoBasedDeviceServices";
import {deviceServicesInterfaceName} from "../../services/IDeviceServices";
import {actionServicesInterfaceName} from "../../services/IActionService";
import {ActionServices} from "../../services/ActionServices";
import ActivityRepository from "../../model/repositories/ActivityRepository";
import BillRepository from "../../model/repositories/BillRepository";
import SqliteInMemoryCommandExecutor from "../../model/sql-components/command-executors/SqliteInMemoryCommandExecutor";
import {commandExecutorName} from "../../model/sql-components/command-executors/CommandExecutor";
import BillValidator from "../../services/BillValidator";
import {repositoryInitiatorName} from "../../services/IRepositoryInitiator";
import SqliteRepositoryInitiator from "../../model/repositories/SqliteRepositoryInitiator";
import ActionObjectRepository from "../../model/repositories/ActionObjectRepository";
import ConsumptionTypeRepository from "../../model/repositories/ConsumptionTypeRepository";
import EventRepository from "../../model/repositories/EventRepository";
import LocationRepository from "../../model/repositories/LocationRepository";
import UserActionRepository from "../../model/repositories/UserActionRepository";

export class DefaultIoCContainer implements IIoCContainer {
    private services: Map<string, any>;

    constructor() {
        this.services = new Map();
        this.initialize();
    }

    private initialize(): void {
        this.initializeRepository();
        this.initializeServices();
    }

    private initializeServices() {
        this.register(deviceServicesInterfaceName
            , new ExpoBasedDeviceServices());
        this.register(BillValidator.billValidatorName
            , new BillValidator());
        this.register(actionServicesInterfaceName
            , new ActionServices(this.resolve(ActivityRepository.activityRepositoryName)
                , this.resolve(BillRepository.billRepositoryName)
                , this.resolve(BillValidator.billValidatorName)));
    }

    private initializeRepository() {
        this.register(commandExecutorName
            , new SqliteInMemoryCommandExecutor());
        this.register(BillRepository.billRepositoryName
            , new BillRepository(this.resolve(commandExecutorName)));
        this.register(ActivityRepository.activityRepositoryName
            , new ActivityRepository(this.resolve(commandExecutorName), this.resolve(BillRepository.billRepositoryName)));
        this.register(repositoryInitiatorName
            , new SqliteRepositoryInitiator(
                this.resolve(ActionObjectRepository.actionObjectRepositoryName)
                , this.resolve(ConsumptionTypeRepository.consumptionTypeRepository)
                , this.resolve(ActivityRepository.activityRepositoryName)
                , this.resolve(BillRepository.billRepositoryName)
                , this.resolve(EventRepository.eventRepositoryName)
                , this.resolve(LocationRepository.locationRepositoryName)
                , this.resolve(UserActionRepository.userActionRepositoryName)
                , 'equiloria_db'
            ));
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


