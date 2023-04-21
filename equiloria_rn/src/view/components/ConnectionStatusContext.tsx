import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {checkInternetConnection} from "../../controller/DeviceServicesController";
import {NetStatus} from "../../common/types/NetStatus";

type ConnectionStatusContextType = {
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
};

const ConnectionStatusContext = createContext<ConnectionStatusContextType>({
    isConnected: null,
    isInternetReachable: null,
});

type ConnectionStatusProviderProps = {
    children: ReactNode;
};

export const ConnectionStatusProvider: React.FC<ConnectionStatusProviderProps> = ({children}) => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);

    useEffect(() => {

        // Function to call check connection method from controller
        const checkConnection = async () => {
            const result: NetStatus = await checkInternetConnection();
            setIsConnected(result.isConnected);
            setIsInternetReachable(result.isInternetReachable);
        };

        // Check connection status initially
        checkConnection();

        // Check connection every 30 seconds
        const intervalId = setInterval(checkConnection, 30000);

        // Clean up the interval on unmount
        return () => {
            clearInterval(intervalId);
        };

    }, []);

    return (
        <ConnectionStatusContext.Provider value={{isConnected, isInternetReachable}}>
            {children}
        </ConnectionStatusContext.Provider>
    );
};

export function useConnectionStatus() {
    return useContext(ConnectionStatusContext);
}
