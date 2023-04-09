import SqliteInMemoryCommandExecutor from "../sql-components/command-executors/SqliteInMemoryCommandExecutor";
import CommandBuilder from "../sql-components/command-builders/CommandBuilder";
import {Entity} from "../entities/Entity";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";

export abstract class BaseRepository<T extends Entity> {
    protected executor: CommandExecutor;

    protected constructor(executor: CommandExecutor) {
        this.executor = executor;
    }

    protected async executeCommand(commandBuilder: CommandBuilder): Promise<any> {
        return await this.executor.execute(commandBuilder);
    }
}
