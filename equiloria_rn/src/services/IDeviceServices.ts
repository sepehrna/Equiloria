import {NetStatus} from "../common/types/NetStatus";
import {LocationCoordinates} from "../common/types/LocationCoordinates";

export const deviceServicesInterfaceName: string = 'IDeviceServices'

export default interface IDeviceServices {
    checkInternetConnection(): Promise<NetStatus>;

    getLocationAccessPermission(): Promise<Boolean>;

    getDeviceLocation(isGranted: boolean): Promise<LocationCoordinates>;

}
