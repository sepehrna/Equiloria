import {initialNetStatus, NetStatus} from "../common/types/NetStatus";
import IDeviceServices, {deviceServicesInterfaceName} from "../services/IDeviceServices";
import ContainerProvider from "./ioc/ContainerProvider";
import {initialLocationCoordinates, LocationCoordinates} from "../common/types/LocationCoordinates";


const deviceServices: IDeviceServices = ContainerProvider.provide().resolve(deviceServicesInterfaceName);

async function checkInternetConnection(): Promise<NetStatus> {
    try {
        return await deviceServices.checkInternetConnection()
    } catch (error) {
        console.error('Error checking internet connection:', error);
    }
    return initialNetStatus;
}

async function getLocationAccessPermission(): Promise<Boolean> {
    try {
        return await deviceServices.getLocationAccessPermission();
    } catch (error) {
        console.error('Error getting location access:', error);
    }
    return false;
}

async function getDeviceLocation(isGranted: boolean): Promise<LocationCoordinates> {
    try {
        return await deviceServices.getDeviceLocation(isGranted);
    } catch (error) {
        console.error('Error getting location access:', error);
    }
    return initialLocationCoordinates;
}

export {checkInternetConnection, getLocationAccessPermission, getDeviceLocation};
