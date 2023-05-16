import CommandBuilder from "../command-builders/CommandBuilder";
import DmlBuilder from "../command-builders/dml/DmlBuilder";
import DdlBuilder from "../command-builders/ddl/DdlBuilder";
import {DqlBuilder} from "../command-builders/dql/DqlBuilder";
import {Entity} from "../../entities/Entity";

// Defining a module 'CommandExecutorDefinition'
export module CommandExecutorDefinition {
    // Setting a constant variable 'COMMAND_EXECUTOR_NAME' 
    // This will be used to represent the name of the CommandExecutor in IoC container
    export const COMMAND_EXECUTOR_NAME: string = 'CommandExecutor';
}

// Interface for CommandExecutor
export default interface CommandExecutor {
    // Method execute: it takes a commandBuilder as input and returns a promise.
    // This is a generic method for executing any command.
    execute(commandBuilder: CommandBuilder): Promise<any>;

    // Method executeNonTransactionalCommand: it takes a DqlBuilder instance as input and returns a promise with an array of Entity.
    // This method is specifically designed to execute non-transactional commands.
    executeNonTransactionalCommand<E extends Entity>(commandBuilder: DqlBuilder<E>): Promise<E[]>;

    // Method executeTransactionalCommand: it takes an array of either DmlBuilder or DdlBuilder instances as input and returns a promise.
    // This method is specifically designed to execute transactional commands.
    executeTransactionalCommand(commandBuilders: DmlBuilder[] | DdlBuilder[]): Promise<any>;

    // Method executeCustomQuery: it takes a custom query string and an entity instance as input and returns a promise with an array of Entity.
    // This method is designed to execute a custom SQL query.
    executeCustomQuery<E extends Entity>(customQuery: string, entityInstance: E): Promise<E[]>;
}
