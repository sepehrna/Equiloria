import * as Network from "expo-network";
import {NetStatus} from "../common/types/NetStatus";

export const DeviceServicesName: string = 'IDeviceServices'

export default interface IDeviceServices {
    checkInternetConnection(): Promise<NetStatus>;

}