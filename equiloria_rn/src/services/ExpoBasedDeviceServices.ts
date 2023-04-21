import IDeviceServices from "./IDeviceServices";
import * as Network from "expo-network";
import {initialNetStatus, NetStatus} from "../common/types/NetStatus";

export default class ExpoBasedDeviceServices implements IDeviceServices {
    async checkInternetConnection(): Promise<NetStatus> {
        try {
            const networkState = await Network.getNetworkStateAsync();
            return {
                isConnected: networkState.isConnected != undefined ? networkState.isConnected : false,
                isInternetReachable: networkState.isInternetReachable != undefined ? networkState.isInternetReachable : false
            }
        } catch (error) {
            console.error('Error checking internet connection:', error);
        }
        return initialNetStatus;
    }
}