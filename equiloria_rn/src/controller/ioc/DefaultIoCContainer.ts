import IIoCContainer from "./IIoCContainer";
import ExpoBasedDeviceServices from "../../services/ExpoBasedDeviceServices";
import {DeviceServicesName} from "../../services/IDeviceServices";

export class DefaultIoCContainer implements IIoCContainer {
    private services: Map<string, any>;

    constructor() {
        this.services = new Map();
    }

    private initialize(): void {
        this.register(DeviceServicesName, new ExpoBasedDeviceServices());
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


