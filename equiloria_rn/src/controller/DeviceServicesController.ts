import {initialNetStatus, NetStatus} from "../common/types/NetStatus";
import {IDeviceServices, IDeviceServicesServiceDefinition} from "../services/IDeviceServices";
import ContainerProvider from "./ioc/ContainerProvider";
import {initialLocationCoordinates, LocationCoordinates} from "../common/types/LocationCoordinates";
import DEVICE_SERVICES_NAME = IDeviceServicesServiceDefinition.DEVICE_SERVICES_NAME;

async function checkInternetConnection(): Promise<NetStatus> {
    try {
        let deviceServices: IDeviceServices = ContainerProvider.provide().resolve(DEVICE_SERVICES_NAME);
        return await deviceServices.checkInternetConnection()
    } catch (error) {
        console.error('Error checking internet connection:', error);
    }
    return initialNetStatus;
}

async function getLocationAccessPermission(): Promise<Boolean> {
    try {
        let deviceServices: IDeviceServices = ContainerProvider.provide().resolve(DEVICE_SERVICES_NAME);
        return await deviceServices.getLocationAccessPermission();
    } catch (error) {
        console.error('Error getting location access:', error);
    }
    return false;
}

async function getDeviceLocation(isGranted: boolean): Promise<LocationCoordinates> {
    try {
        let deviceServices: IDeviceServices = ContainerProvider.provide().resolve(DEVICE_SERVICES_NAME);
        return await deviceServices.getDeviceLocation(isGranted);
    } catch (error) {
        console.error('Error getting location access:', error);
    }
    return initialLocationCoordinates;
}

export {checkInternetConnection, getLocationAccessPermission, getDeviceLocation};
