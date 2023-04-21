type NetStatus = {
    isConnected: boolean;
    isInternetReachable: boolean;
}

const initialNetStatus: NetStatus = {
    isConnected: false,
    isInternetReachable: false
}
export {NetStatus, initialNetStatus};