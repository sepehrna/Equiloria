import {DefaultIoCContainer} from "./DefaultIoCContainer";
import IRepositoryInitiator, {RepositoryInitiatorDefinition} from "../../services/IRepositoryInitiator";
import REPOSITORY_INITIATOR_NAME = RepositoryInitiatorDefinition.REPOSITORY_INITIATOR_NAME;
import ContainerProvider from "./ContainerProvider";

async function initSystem(platform: string): Promise<void> {
    handleLog(platform);
    let ioCContainer: DefaultIoCContainer = ContainerProvider.provide() as DefaultIoCContainer;
    ioCContainer.initialize();
    let iRepositoryInitiator: IRepositoryInitiator = ioCContainer.resolve(REPOSITORY_INITIATOR_NAME) as IRepositoryInitiator;
    if (iRepositoryInitiator != null) {
        await iRepositoryInitiator.initializeDatabase(ContainerProvider.defaultDatabaseName);
    }
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

export {handleLog, initSystem};
