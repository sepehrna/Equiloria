import {Entity} from "../entities/Entity";
import CommandExecutor from "../sql-components/command-executors/CommandExecutor";
import DmlBuilder from "../sql-components/command-builders/dml/DmlBuilder";
import DdlBuilder from "../sql-components/command-builders/ddl/DdlBuilder";
import {DqlBuilder} from "../sql-components/command-builders/dql/DqlBuilder";
import CommandAggregator from "./aggregators/CommandAggregator";

export abstract class BaseRepository<T extends Entity> {
    private executor: CommandExecutor;

    protected constructor(executor: CommandExecutor) {
        this.executor = executor;
    }

    protected async executeDmlCommand(commandBuilder: DmlBuilder): Promise<any> {
        return await this.executor.executeTransactionalCommand([commandBuilder]);
    }

    protected async executeDmlCommandsWithAggregator(commandAggregator: CommandAggregator<DmlBuilder>): Promise<any> {
        return await this.executor.executeTransactionalCommand(commandAggregator.aggregate());
    }

    protected async executeDdlCommand(commandBuilder: DdlBuilder): Promise<any> {
        return await this.executor.executeTransactionalCommand([commandBuilder]);
    }

    protected async executeDqlCommand<E extends Entity>(commandBuilder: DqlBuilder<E>): Promise<E[]> {
        return await this.executor.executeNonTransactionalCommand(commandBuilder);
    }

    protected async executeCustomDqlCommand<E extends Entity>(command: string, instance: E): Promise<E[]> {
        return await this.executor.executeCustomQuery(command, instance);
    }
}
