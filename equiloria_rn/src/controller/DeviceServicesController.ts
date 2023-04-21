import {initialNetStatus, NetStatus} from "../common/types/NetStatus";
import IDeviceServices, {DeviceServicesName} from "../services/IDeviceServices";
import ContainerProvider from "./ioc/ContainerProvider";


const deviceServices: IDeviceServices = ContainerProvider.provide().resolve(DeviceServicesName);

async function checkInternetConnection(): Promise<NetStatus> {
    try {
        return await deviceServices.checkInternetConnection()
    } catch (error) {
        console.error('Error checking internet connection:', error);
    }
    return initialNetStatus;
}

export {checkInternetConnection};