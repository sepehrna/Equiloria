export const repositoryInitiatorName: string = 'IRepositoryInitiator';

interface IRepositoryInitiator {
    initializeDatabase(): Promise<Boolean>;
}

export default IRepositoryInitiator;