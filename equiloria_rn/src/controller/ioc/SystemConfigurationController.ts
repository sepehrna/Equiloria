import IRepositoryInitiator, {repositoryInitiatorName} from "../../services/IRepositoryInitiator";
import ContainerProvider from "./ContainerProvider";

const repositoryInitiator: IRepositoryInitiator = ContainerProvider.provide().resolve(repositoryInitiatorName);
async function initSystem(platform: string): Promise<void> {
    handleLog(platform);
    await repositoryInitiator.initializeDatabase();
}
function handleLog(platform: string) {

    if (platform !== 'web') {
        const originalConsoleLog = console.log;
        const originalConsoleWarn = console.warn;
        const originalConsoleError = console.error;
        const customConsoleMethod = (originalMethod: (...args: any[]) => void) => {
            return (...args: any[]) => {
                const logMessage = args.join(' ');

                // Unnecessary log to ignore should replace with the below message
                const logToIgnore = 'No scrollTo method provided.';

                if (!logMessage.includes(logToIgnore)) {
                    originalMethod(...args);
                }
            };
        };
        console.log = customConsoleMethod(originalConsoleLog);
        console.warn = customConsoleMethod(originalConsoleWarn);
        console.error = customConsoleMethod(originalConsoleError);
    }
}

export {handleLog};

export {initSystem};