import CommandBuilder from "../command-builders/CommandBuilder";
import DmlBuilder from "../command-builders/dml/DmlBuilder";
import DdlBuilder from "../command-builders/ddl/DdlBuilder";
import {DqlBuilder} from "../command-builders/dql/DqlBuilder";
import {Entity} from "../../entities/Entity";

export const commandExecutorName: string = 'CommandExecutor';
export default interface CommandExecutor {

    execute(commandBuilder: CommandBuilder): Promise<any>;

    executeNonTransactionalCommand<E extends Entity>(commandBuilder: DqlBuilder<E>): Promise<E[]>;

    executeTransactionalCommand(commandBuilders: DmlBuilder[] | DdlBuilder[]): Promise<any>;

}