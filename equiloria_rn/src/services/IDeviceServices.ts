import {NetStatus} from "../common/types/NetStatus";
import {LocationCoordinates} from "../common/types/LocationCoordinates";

export module IDeviceServicesServiceDefinition {
    export const DEVICE_SERVICES_NAME: string = 'IDeviceServices'
}
export interface IDeviceServices {

    checkInternetConnection(): Promise<NetStatus>;

    getLocationAccessPermission(): Promise<Boolean>;

    getDeviceLocation(isGranted: boolean): Promise<LocationCoordinates>;

}
