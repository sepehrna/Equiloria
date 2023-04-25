import IDeviceServices from "./IDeviceServices";
import * as Network from "expo-network";
import {initialNetStatus, NetStatus} from "../common/types/NetStatus";
import {initialLocationCoordinates, LocationCoordinates} from "../common/types/LocationCoordinates";
import * as Location from 'expo-location';


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

    async getLocationAccessPermission(): Promise<Boolean> {
        try {
            // Request permissions
            const {status} = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return false;
            }

            return true;
        } catch (error) {
            console.log('Error getting location access:', error);
            return false;
        }
    }

    async getDeviceLocation(isGranted: boolean): Promise<LocationCoordinates> {
        if (isGranted) {
            try {
                // Get device location
                const location = await Location.getCurrentPositionAsync({});
                console.log('Latitude:', location.coords.latitude, 'Longitude:', location.coords.longitude);
                return {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                };
            } catch (error) {
                console.log('Error getting location:', error);
            }
        }
        else {
            console.log('Location access was denied');
        }
        return initialLocationCoordinates;
    }

}