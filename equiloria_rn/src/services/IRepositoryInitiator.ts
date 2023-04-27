export module RepositoryInitiatorDefinition {
    export const REPOSITORY_INITIATOR_NAME: string = 'IRepositoryInitiator';
}
interface IRepositoryInitiator {
    initializeDatabase(dbName: string): Promise<Boolean>;
}

export default IRepositoryInitiator;